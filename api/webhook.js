import { MercadoPagoConfig, Payment } from 'mercadopago';
import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

const mpClient = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

// Cache the db across warm Lambda invocations
let db = null;

function getDb() {
  if (db) return db;

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON não está configurado no ambiente');

  let serviceAccount;
  try {
    serviceAccount = JSON.parse(raw);
  } catch (e) {
    throw new Error(`FIREBASE_SERVICE_ACCOUNT_JSON não é um JSON válido: ${e.message}`);
  }

  const app =
    getApps().length > 0
      ? getApp()
      : initializeApp({ credential: cert(serviceAccount) });

  db = getFirestore(app);
  return db;
}

export default async function handler(req, res) {
  // MP faz GET para validar a URL antes de começar a enviar eventos
  if (req.method === 'GET') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { type, data } = req.body ?? {};

  // Ignorar eventos que não sejam de pagamento
  if (type !== 'payment' || !data?.id) return res.status(200).end();

  // Inicializar Admin SDK — retorna 500 para que o MP reenvie se a config está quebrada
  let firestore;
  try {
    firestore = getDb();
  } catch (err) {
    console.error('[webhook] ERRO DE CONFIGURAÇÃO — Firebase Admin SDK não inicializado:', err.message);
    return res.status(500).json({ error: err.message });
  }

  try {
    const payment = new Payment(mpClient);
    const paymentData = await payment.get({ id: data.id });

    if (paymentData.status !== 'approved') {
      console.log(`[webhook] pagamento ${data.id} ignorado — status: ${paymentData.status}`);
      return res.status(200).end();
    }

    const uid = paymentData.external_reference;
    if (!uid) {
      console.error('[webhook] pagamento aprovado sem external_reference:', data.id);
      return res.status(200).end();
    }

    const deckId = 'proibidao';

    await firestore
      .collection('users')
      .doc(uid)
      .set(
        {
          purchases: {
            [deckId]: {
              deckId,
              source: 'mercadopago',
              paymentId: String(paymentData.id),
              purchasedAt: FieldValue.serverTimestamp(),
            },
          },
        },
        { merge: true }
      );

    await firestore
      .collection('purchases')
      .doc(`${uid}_${deckId}`)
      .set(
        {
          uid,
          deckId,
          source: 'mercadopago',
          paymentId: String(paymentData.id),
          purchasedAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

    console.log(`[webhook] compra registrada — uid: ${uid}, payment: ${paymentData.id}`);
    return res.status(200).end();
  } catch (err) {
    // Loga code + message para ver exatamente "PERMISSION_DENIED" ou outro erro do Firestore
    console.error('[webhook] erro ao processar pagamento:', err.code ?? '', err.message);
    // Retorna 500 para que o MP reenvie — o Admin SDK não deveria ter PERMISSION_DENIED
    // com credenciais válidas; se estiver acontecendo, precisamos do retry para investigar
    return res.status(500).json({ error: err.message });
  }
}

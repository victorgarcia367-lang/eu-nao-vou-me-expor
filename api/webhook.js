import { MercadoPagoConfig, Payment } from 'mercadopago';
import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

const mpClient = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

function getDb() {
  const app =
    getApps().length > 0
      ? getApp()
      : initializeApp({ credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)) });
  return getFirestore(app);
}

export default async function handler(req, res) {
  // MP faz GET para validar a URL antes de começar a enviar eventos
  if (req.method === 'GET') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { type, data } = req.body ?? {};

  // Ignorar eventos que não sejam de pagamento
  if (type !== 'payment' || !data?.id) return res.status(200).end();

  try {
    const payment = new Payment(mpClient);
    const paymentData = await payment.get({ id: data.id });

    if (paymentData.status !== 'approved') return res.status(200).end();

    const uid = paymentData.external_reference;
    if (!uid) {
      console.error('[webhook] pagamento aprovado sem external_reference:', data.id);
      return res.status(200).end();
    }

    const deckId = 'proibidao';
    const db = getDb();

    // Atualiza users/{uid} com a compra (merge para não sobrescrever outros dados)
    await db
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

    // Log de compra para o admin
    await db
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
    console.error('[webhook] erro ao processar pagamento:', err);
    // Retorna 200 para o MP não retentar indefinidamente para erros nossos
    return res.status(200).end();
  }
}

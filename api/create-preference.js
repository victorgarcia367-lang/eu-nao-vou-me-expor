import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { uid } = req.body;
  if (!uid) {
    return res.status(400).json({ error: 'uid obrigatório' });
  }

  const appUrl = process.env.APP_URL;
  if (!appUrl) {
    return res.status(500).json({ error: 'APP_URL não configurada' });
  }

  try {
    const preference = new Preference(client);
    const result = await preference.create({
      body: {
        items: [
          {
            id: 'proibidao',
            title: 'Baralho Proibidão — Eu Não Vou Me Expor',
            quantity: 1,
            unit_price: 9.99,
            currency_id: 'BRL',
          },
        ],
        external_reference: uid,
        notification_url: `${appUrl}/api/webhook`,
        back_urls: {
          success: `${appUrl}/?payment=success`,
          failure: `${appUrl}/?payment=failure`,
          pending: `${appUrl}/?payment=pending`,
        },
        auto_return: 'approved',
      },
    });

    return res.status(200).json({ init_point: result.init_point });
  } catch (err) {
    console.error('[create-preference] erro:', err);
    return res.status(500).json({ error: 'Erro ao criar preferência de pagamento' });
  }
}

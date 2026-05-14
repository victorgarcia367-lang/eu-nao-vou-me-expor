    import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import 'dotenv/config';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const COUPONS = [
  { code: 'PROIBIDAO2024', deckId: 'proibidao', note: 'Cupom de lançamento' },
  { code: 'AMIGO',         deckId: 'proibidao', note: 'Cupom para amigos'   },
  { code: 'BETA',          deckId: 'proibidao', note: 'Cupom beta testers'  },
];

async function seed() {
  console.log('Populando cupons no Firestore...');
  for (const c of COUPONS) {
    await setDoc(doc(db, 'coupons', c.code), {
      code: c.code,
      deckId: c.deckId,
      note: c.note,
      usedBy: null,
      usedAt: null,
      createdAt: serverTimestamp(),
    });
    console.log(`✅ ${c.code}`);
  }
  console.log('Pronto! Cupons criados no Firestore.');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
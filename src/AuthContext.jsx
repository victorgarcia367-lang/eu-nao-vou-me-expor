import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from './firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);
  const [isPremium, setIsPremium] = useState(false);
  const [loadingPremium, setLoadingPremium] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await syncPremium(firebaseUser.uid);
      } else {
        setIsPremium(false);
      }
    });
    return unsub;
  }, []);

  const syncPremium = async (uid) => {
    setLoadingPremium(true);
    try {
      const ref = doc(db, 'users', uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        const hasPremium = data.purchases && Object.keys(data.purchases).length > 0;
        setIsPremium(hasPremium);
      } else {
        await setDoc(ref, {
          uid,
          email: auth.currentUser?.email || null,
          displayName: auth.currentUser?.displayName || null,
          photoURL: auth.currentUser?.photoURL || null,
          createdAt: serverTimestamp(),
          purchases: {},
        });
        setIsPremium(false);
      }
    } catch (err) {
      console.error('Erro ao sincronizar premium:', err);
      setIsPremium(false);
    } finally {
      setLoadingPremium(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (err) {
      console.error('Erro no login Google:', err);
      throw err;
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setIsPremium(false);
  };

  const registerPurchase = async (deckId, source, couponCode = null) => {
    if (!user) throw new Error('Usuário não autenticado');
    const ref = doc(db, 'users', user.uid);
    const purchase = {
      deckId,
      source,
      couponCode,
      purchasedAt: serverTimestamp(),
    };
    await setDoc(ref, { purchases: { [deckId]: purchase } }, { merge: true });
    const purchaseRef = doc(db, 'purchases', `${user.uid}_${deckId}`);
    await setDoc(purchaseRef, { uid: user.uid, email: user.email, ...purchase });
    setIsPremium(true);
  };

  const redeemCoupon = async (code, deckId) => {
    if (!user) throw new Error('Usuário não autenticado');
    const couponRef = doc(db, 'coupons', code.toUpperCase());
    const couponSnap = await getDoc(couponRef);
    if (!couponSnap.exists()) throw new Error('Cupom inválido ou já utilizado.');
    const coupon = couponSnap.data();
    if (coupon.usedBy) throw new Error('Cupom inválido ou já utilizado.');
    if (coupon.expiresAt && coupon.expiresAt.toDate() < new Date()) throw new Error('Cupom expirado.');
    await setDoc(couponRef, { usedBy: user.uid, usedAt: serverTimestamp() }, { merge: true });
    await registerPurchase(deckId, 'coupon', code.toUpperCase());
  };

  const value = {
    user,
    isPremium,
    loadingPremium,
    signInWithGoogle,
    signOut,
    registerPurchase,
    redeemCoupon,
    syncPremium,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
};
import React, { useState, useEffect } from 'react';
import {
  collection, getDocs, doc, setDoc, deleteDoc,
  serverTimestamp, updateDoc, query, orderBy
} from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { db } from './firebase';

// ── Config ──────────────────────────────────────────────
const ADMIN_EMAIL = 'victorgarcia367@gmail.com';

const C = {
  bg: '#000000', card: '#0c0c0c', ink: '#ffffff',
  inkMuted: '#aaaaaa', inkSoft: '#888888', border: '#2e2e2e',
  green: '#9fff3d', red: '#ff3d5a', blue: '#7b87ff',
};
const TITLE = '"Archivo", sans-serif';
const BODY = '"Inter", sans-serif';

// ── Helpers ─────────────────────────────────────────────
function Btn({ children, onClick, bg = C.ink, color = '#000', border = C.ink, disabled, small }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: disabled ? '#222' : bg,
      color: disabled ? C.inkMuted : color,
      border: `1.5px solid ${disabled ? C.border : border}`,
      borderRadius: '10px',
      padding: small ? '0.35rem 0.8rem' : '0.7rem 1.2rem',
      fontFamily: BODY, fontWeight: 700,
      fontSize: small ? '0.72rem' : '0.85rem',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'opacity 0.15s',
    }}>
      {children}
    </button>
  );
}

function Badge({ label, color }) {
  return (
    <span style={{
      background: `${color}22`, border: `1px solid ${color}55`,
      borderRadius: '100px', padding: '0.15rem 0.6rem',
      fontFamily: BODY, fontSize: '0.6rem', color, fontWeight: 700,
    }}>
      {label}
    </span>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: C.card, border: `1.5px solid ${C.border}`,
      borderRadius: '16px', padding: '1.2rem',
      marginBottom: '1rem', ...style
    }}>
      {children}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div style={{
      fontFamily: BODY, fontSize: '0.65rem', color: C.inkMuted,
      fontWeight: 700, letterSpacing: '0.15em', marginBottom: '0.8rem'
    }}>
      {children}
    </div>
  );
}

// ── Login ────────────────────────────────────────────────
function AdminLogin({ onLogin }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      if (result.user.email !== ADMIN_EMAIL) {
        await signOut(auth);
        setError('Acesso restrito. Use a conta de administrador.');
      }
    } catch (e) {
      setError('Erro ao fazer login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: C.bg, display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: '2rem'
    }}>
      <div style={{
        background: C.card, border: `1.5px solid ${C.border}`,
        borderRadius: '20px', padding: '2.5rem', width: '100%', maxWidth: '380px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>🛡️</div>
        <div style={{
          fontFamily: TITLE, fontWeight: 900, fontSize: '1.5rem',
          color: C.ink, letterSpacing: '-0.03em', marginBottom: '0.4rem'
        }}>
          Painel Admin
        </div>
        <div style={{
          fontFamily: BODY, fontSize: '0.8rem', color: C.inkMuted,
          marginBottom: '1.8rem'
        }}>
          Eu Não Vou Me Expor
        </div>
        <button onClick={handleLogin} disabled={loading} style={{
          width: '100%', background: '#fff', border: 'none',
          borderRadius: '12px', padding: '0.85rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
          cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1
        }}>
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16 19 12 24 12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.1l-6.2-5.2C29.3 35.5 26.8 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
            <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.4 4.3-4.4 5.7l6.2 5.2C36.9 40.1 44 35 44 24c0-1.3-.1-2.6-.4-3.9z"/>
          </svg>
          <span style={{ fontFamily: BODY, fontWeight: 700, fontSize: '0.9rem', color: '#222' }}>
            {loading ? 'Entrando...' : 'Entrar com Google'}
          </span>
        </button>
        {error && (
          <div style={{ fontFamily: BODY, fontSize: '0.75rem', color: C.red, marginTop: '1rem' }}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Painel principal ─────────────────────────────────────
function AdminPanel({ user, onLogout }) {
  const [tab, setTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Novo cupom
  const [newCode, setNewCode] = useState('');
  const [newNote, setNewNote] = useState('');
  const [newDeck, setNewDeck] = useState('proibidao');
  const [creating, setCreating] = useState(false);
  const [createMsg, setCreateMsg] = useState('');

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [usersSnap, couponsSnap] = await Promise.all([
        getDocs(collection(db, 'users')),
        getDocs(collection(db, 'coupons')),
      ]);
      setUsers(usersSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setCoupons(couponsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  // Stats
  const totalUsers = users.length;
  const premiumUsers = users.filter(u => u.purchases && Object.keys(u.purchases).length > 0).length;
  const totalCoupons = coupons.length;
  const usedCoupons = coupons.filter(c => c.usedBy).length;

  // Toggle premium
  const togglePremium = async (u) => {
    const hasPremium = u.purchases && Object.keys(u.purchases).length > 0;
    const ref = doc(db, 'users', u.id);
    if (hasPremium) {
      await updateDoc(ref, { purchases: {} });
    } else {
      await setDoc(ref, {
        purchases: {
          proibidao: {
            deckId: 'proibidao',
            source: 'admin',
            couponCode: null,
            purchasedAt: serverTimestamp(),
          }
        }
      }, { merge: true });
    }
    fetchAll();
  };

  // Criar cupom
  const createCoupon = async () => {
    const code = newCode.trim().toUpperCase();
    if (!code) { setCreateMsg('Digite um código.'); return; }
    if (coupons.find(c => c.id === code)) { setCreateMsg('Esse código já existe.'); return; }
    setCreating(true);
    setCreateMsg('');
    try {
      await setDoc(doc(db, 'coupons', code), {
        code,
        deckId: newDeck,
        note: newNote.trim() || '',
        usedBy: null,
        usedAt: null,
        createdAt: serverTimestamp(),
      });
      setNewCode('');
      setNewNote('');
      setCreateMsg('✅ Cupom criado!');
      fetchAll();
    } catch (e) {
      setCreateMsg('Erro ao criar cupom.');
    } finally {
      setCreating(false);
    }
  };

  // Deletar cupom
  const deleteCoupon = async (code) => {
    if (!window.confirm(`Deletar o cupom "${code}"?`)) return;
    await deleteDoc(doc(db, 'coupons', code));
    fetchAll();
  };

  // Resetar cupom usado
  const resetCoupon = async (code) => {
    await updateDoc(doc(db, 'coupons', code), { usedBy: null, usedAt: null });
    fetchAll();
  };

  const tabs = [
    { id: 'overview', label: '📊 Visão geral' },
    { id: 'users', label: '👥 Usuários' },
    { id: 'coupons', label: '🎟️ Cupons' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.ink, fontFamily: BODY }}>
      {/* Header */}
      <div style={{
        background: C.card, borderBottom: `1px solid ${C.border}`,
        padding: '1rem 2rem', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div style={{ fontSize: '1.2rem' }}>🛡️</div>
          <div style={{ fontFamily: TITLE, fontWeight: 900, fontSize: '1rem', letterSpacing: '-0.02em' }}>
            Admin · Eu Não Vou Me Expor
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ fontFamily: BODY, fontSize: '0.75rem', color: C.inkMuted }}>
            {user.email}
          </div>
          <Btn onClick={onLogout} bg="transparent" color={C.inkMuted} border={C.border} small>
            Sair
          </Btn>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        borderBottom: `1px solid ${C.border}`,
        padding: '0 2rem', display: 'flex', gap: '0.3rem'
      }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            background: 'none', border: 'none', borderBottom: `2px solid ${tab === t.id ? C.ink : 'transparent'}`,
            color: tab === t.id ? C.ink : C.inkMuted,
            fontFamily: BODY, fontWeight: 600, fontSize: '0.82rem',
            padding: '0.8rem 1rem', cursor: 'pointer', transition: 'color 0.15s'
          }}>
            {t.label}
          </button>
        ))}
        <button onClick={fetchAll} style={{
          background: 'none', border: 'none', color: C.inkMuted,
          fontFamily: BODY, fontSize: '0.75rem', cursor: 'pointer',
          marginLeft: 'auto', padding: '0.8rem 0'
        }}>
          ↻ atualizar
        </button>
      </div>

      {/* Conteúdo */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
        {loading ? (
          <div style={{ color: C.inkMuted, fontFamily: BODY, fontSize: '0.85rem' }}>Carregando...</div>
        ) : (
          <>
            {/* ── OVERVIEW ── */}
            {tab === 'overview' && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                  {[
                    { label: 'Usuários cadastrados', value: totalUsers, color: C.blue },
                    { label: 'Usuários premium', value: premiumUsers, color: C.green },
                    { label: 'Cupons criados', value: totalCoupons, color: C.ink },
                    { label: 'Cupons utilizados', value: usedCoupons, color: C.red },
                  ].map((s, i) => (
                    <div key={i} style={{
                      background: C.card, border: `1.5px solid ${C.border}`,
                      borderRadius: '14px', padding: '1.2rem'
                    }}>
                      <div style={{ fontFamily: BODY, fontSize: '0.65rem', color: C.inkMuted, fontWeight: 700, letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                        {s.label.toUpperCase()}
                      </div>
                      <div style={{ fontFamily: TITLE, fontWeight: 900, fontSize: '2.5rem', color: s.color, letterSpacing: '-0.04em', lineHeight: 1 }}>
                        {s.value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Últimos usuários */}
                <Card>
                  <SectionTitle>ÚLTIMOS USUÁRIOS</SectionTitle>
                  {users.slice(0, 5).map(u => (
                    <div key={u.id} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '0.6rem 0', borderBottom: `1px solid ${C.border}`
                    }}>
                      <div>
                        <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: '0.85rem', color: C.ink }}>
                          {u.displayName || u.email || u.id.slice(0, 10)}
                        </div>
                        <div style={{ fontFamily: BODY, fontSize: '0.7rem', color: C.inkMuted }}>{u.email}</div>
                      </div>
                      {u.purchases && Object.keys(u.purchases).length > 0
                        ? <Badge label="PREMIUM" color={C.green} />
                        : <Badge label="FREE" color={C.inkMuted} />}
                    </div>
                  ))}
                </Card>
              </div>
            )}

            {/* ── USUÁRIOS ── */}
            {tab === 'users' && (
              <Card>
                <SectionTitle>TODOS OS USUÁRIOS ({totalUsers})</SectionTitle>
                {users.length === 0 && (
                  <div style={{ color: C.inkMuted, fontSize: '0.82rem' }}>Nenhum usuário cadastrado ainda.</div>
                )}
                {users.map(u => {
                  const hasPremium = u.purchases && Object.keys(u.purchases).length > 0;
                  return (
                    <div key={u.id} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      flexWrap: 'wrap', gap: '0.5rem',
                      padding: '0.8rem 0', borderBottom: `1px solid ${C.border}`
                    }}>
                      <div style={{ flex: 1, minWidth: '200px' }}>
                        <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: '0.85rem', color: C.ink }}>
                          {u.displayName || '—'}
                        </div>
                        <div style={{ fontFamily: BODY, fontSize: '0.7rem', color: C.inkMuted }}>{u.email}</div>
                        <div style={{ fontFamily: BODY, fontSize: '0.62rem', color: C.inkSoft, marginTop: '0.1rem' }}>
                          uid: {u.id.slice(0, 16)}...
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        {hasPremium ? <Badge label="PREMIUM" color={C.green} /> : <Badge label="FREE" color={C.inkMuted} />}
                        <Btn
                          onClick={() => togglePremium(u)}
                          bg={hasPremium ? C.red : C.green}
                          color="#000"
                          border={hasPremium ? C.red : C.green}
                          small
                        >
                          {hasPremium ? 'Remover premium' : 'Dar premium'}
                        </Btn>
                      </div>
                    </div>
                  );
                })}
              </Card>
            )}

            {/* ── CUPONS ── */}
            {tab === 'coupons' && (
              <div>
                {/* Criar novo */}
                <Card>
                  <SectionTitle>CRIAR CUPOM</SectionTitle>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '0.7rem' }}>
                    <input
                      value={newCode}
                      onChange={e => setNewCode(e.target.value.toUpperCase())}
                      placeholder="CÓDIGO (ex: AMIGO50)"
                      style={{
                        flex: '1 1 160px', background: '#111', border: `1px solid ${C.border}`,
                        borderRadius: '10px', padding: '0.65rem 0.9rem',
                        color: C.ink, fontFamily: BODY, fontSize: '0.85rem',
                        outline: 'none', letterSpacing: '0.05em', fontWeight: 700
                      }}
                    />
                    <input
                      value={newNote}
                      onChange={e => setNewNote(e.target.value)}
                      placeholder="Descrição (opcional)"
                      style={{
                        flex: '2 1 200px', background: '#111', border: `1px solid ${C.border}`,
                        borderRadius: '10px', padding: '0.65rem 0.9rem',
                        color: C.ink, fontFamily: BODY, fontSize: '0.85rem', outline: 'none'
                      }}
                    />
                    <Btn onClick={createCoupon} disabled={creating} bg={C.green} color="#000" border={C.green}>
                      {creating ? 'Criando...' : '+ Criar'}
                    </Btn>
                  </div>
                  {createMsg && (
                    <div style={{ fontFamily: BODY, fontSize: '0.75rem', color: createMsg.startsWith('✅') ? C.green : C.red }}>
                      {createMsg}
                    </div>
                  )}
                </Card>

                {/* Lista de cupons */}
                <Card>
                  <SectionTitle>TODOS OS CUPONS ({totalCoupons})</SectionTitle>
                  {coupons.length === 0 && (
                    <div style={{ color: C.inkMuted, fontSize: '0.82rem' }}>Nenhum cupom criado ainda.</div>
                  )}
                  {coupons.map(c => (
                    <div key={c.id} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      flexWrap: 'wrap', gap: '0.5rem',
                      padding: '0.8rem 0', borderBottom: `1px solid ${C.border}`
                    }}>
                      <div style={{ flex: 1, minWidth: '180px' }}>
                        <div style={{ fontFamily: TITLE, fontWeight: 900, fontSize: '0.95rem', color: C.ink, letterSpacing: '0.03em' }}>
                          {c.code}
                        </div>
                        <div style={{ fontFamily: BODY, fontSize: '0.7rem', color: C.inkMuted }}>{c.note || '—'}</div>
                        {c.usedBy && (
                          <div style={{ fontFamily: BODY, fontSize: '0.65rem', color: C.red, marginTop: '0.1rem' }}>
                            usado por: {c.usedBy.slice(0, 16)}...
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {c.usedBy
                          ? <Badge label="USADO" color={C.red} />
                          : <Badge label="DISPONÍVEL" color={C.green} />}
                        {c.usedBy && (
                          <Btn onClick={() => resetCoupon(c.id)} bg="transparent" color={C.inkMuted} border={C.border} small>
                            Resetar
                          </Btn>
                        )}
                        <Btn onClick={() => deleteCoupon(c.id)} bg="transparent" color={C.red} border={C.red} small>
                          Deletar
                        </Btn>
                      </div>
                    </div>
                  ))}
                </Card>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ── Root ────────────────────────────────────────────────
export default function Admin() {
  const [user, setUser] = useState(undefined); // undefined = carregando

  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u && u.email === ADMIN_EMAIL) setUser(u);
      else setUser(null);
    });
    return unsub;
  }, []);

  const handleLogout = async () => {
    await signOut(getAuth());
    setUser(null);
  };

  if (user === undefined) return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#888', fontFamily: 'sans-serif' }}>Carregando...</div>
    </div>
  );

  if (!user) return <AdminLogin onLogin={() => {}} />;
  return <AdminPanel user={user} onLogout={handleLogout} />;
}

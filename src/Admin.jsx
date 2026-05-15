import React, { useState, useEffect } from 'react';
import {
  collection, getDocs, doc, setDoc, deleteDoc,
  serverTimestamp, updateDoc, query, orderBy, limit,
  addDoc, Timestamp,
} from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { db } from './firebase';

// ── Config ──────────────────────────────────────────────
const ADMIN_EMAIL = 'victorgarcia367@gmail.com';
const USERS_PER_PAGE = 20;

const C = {
  bg: '#000000', card: '#0c0c0c', ink: '#ffffff',
  inkMuted: '#aaaaaa', inkSoft: '#888888', border: '#2e2e2e',
  green: '#9fff3d', red: '#ff3d5a', blue: '#7b87ff',
};
const TITLE = '"Archivo", sans-serif';
const BODY = '"Inter", sans-serif';

// ── UI helpers ───────────────────────────────────────────
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
      fontWeight: 700, letterSpacing: '0.15em', marginBottom: '0.8rem',
    }}>
      {children}
    </div>
  );
}

function actionLabel(action) {
  const MAP = {
    grant_premium: '✅ Premium concedido',
    revoke_premium: '❌ Premium removido',
    create_coupon: '🎟️ Cupom criado',
    delete_coupon: '🗑️ Cupom deletado',
    reset_coupon: '↩️ Cupom resetado',
  };
  return MAP[action] ?? action;
}

// ── Login ────────────────────────────────────────────────
function AdminLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const auth = getAuth();
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      if (result.user.email !== ADMIN_EMAIL) {
        await signOut(auth);
        setError('Acesso restrito. Use a conta de administrador.');
      }
    } catch {
      setError('Erro ao fazer login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: C.bg, display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: '2rem',
    }}>
      <div style={{
        background: C.card, border: `1.5px solid ${C.border}`,
        borderRadius: '20px', padding: '2.5rem', width: '100%', maxWidth: '380px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>🛡️</div>
        <div style={{ fontFamily: TITLE, fontWeight: 900, fontSize: '1.5rem', color: C.ink, letterSpacing: '-0.03em', marginBottom: '0.4rem' }}>
          Painel Admin
        </div>
        <div style={{ fontFamily: BODY, fontSize: '0.8rem', color: C.inkMuted, marginBottom: '1.8rem' }}>
          Eu Não Vou Me Expor
        </div>
        <button onClick={handleLogin} disabled={loading} style={{
          width: '100%', background: '#fff', border: 'none',
          borderRadius: '12px', padding: '0.85rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
          cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
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
          <div style={{ fontFamily: BODY, fontSize: '0.75rem', color: C.red, marginTop: '1rem' }}>{error}</div>
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
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Novo cupom
  const [newCode, setNewCode] = useState('');
  const [newNote, setNewNote] = useState('');
  const [newDeck, setNewDeck] = useState('proibidao');
  const [newExpiry, setNewExpiry] = useState('');
  const [creating, setCreating] = useState(false);
  const [createMsg, setCreateMsg] = useState('');

  // Users tab
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);

  // Coupon copy feedback
  const [copiedCode, setCopiedCode] = useState(null);

  // ── Fetch ──────────────────────────────────────────────
  const fetchLogs = async () => {
    try {
      const q = query(collection(db, 'admin_logs'), orderBy('timestamp', 'desc'), limit(10));
      const snap = await getDocs(q);
      setLogs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error('Erro ao carregar logs:', e);
    }
  };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [usersSnap, couponsSnap] = await Promise.all([
        getDocs(collection(db, 'users')),
        getDocs(collection(db, 'coupons')),
      ]);
      setUsers(usersSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setCoupons(couponsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      await fetchLogs();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);
  useEffect(() => { setCurrentPage(1); }, [searchQuery, statusFilter, sortField, sortDir]);

  // ── Log de ações ───────────────────────────────────────
  const logAction = async (action, target) => {
    try {
      await addDoc(collection(db, 'admin_logs'), {
        action,
        target: String(target),
        adminEmail: user.email,
        timestamp: serverTimestamp(),
      });
    } catch (e) {
      console.error('Erro ao registrar log:', e);
    }
  };

  // ── Métricas ───────────────────────────────────────────
  const totalUsers = users.length;
  const premiumUsers = users.filter(u => u.purchases && Object.keys(u.purchases).length > 0).length;
  const totalCoupons = coupons.length;
  const usedCoupons = coupons.filter(c => c.usedBy).length;
  const payingCount = users.filter(u => {
    const p = u.purchases && Object.values(u.purchases)[0];
    return p?.source === 'mercadopago' || p?.source === 'payment';
  }).length;
  const estimatedRevenue = (payingCount * 9.99).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  // ── Usuários filtrados / ordenados / paginados ─────────
  const filteredUsers = users.filter(u => {
    if (searchQuery && !(u.email || '').toLowerCase().includes(searchQuery.toLowerCase())) return false;
    const hasPremium = u.purchases && Object.keys(u.purchases).length > 0;
    if (statusFilter === 'premium') return hasPremium;
    if (statusFilter === 'free') return !hasPremium;
    if (statusFilter === 'coupon') return u.purchases?.proibidao?.source === 'coupon';
    return true;
  });

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const arrow = (field) => sortField === field ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ' ↕';

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortField === 'email') {
      const av = (a.email || '').toLowerCase(), bv = (b.email || '').toLowerCase();
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    }
    if (sortField === 'createdAt') {
      const av = a.createdAt?.toDate?.()?.getTime() ?? 0;
      const bv = b.createdAt?.toDate?.()?.getTime() ?? 0;
      return sortDir === 'asc' ? av - bv : bv - av;
    }
    if (sortField === 'status') {
      const av = a.purchases && Object.keys(a.purchases).length > 0 ? 1 : 0;
      const bv = b.purchases && Object.keys(b.purchases).length > 0 ? 1 : 0;
      return sortDir === 'asc' ? av - bv : bv - av;
    }
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(sortedUsers.length / USERS_PER_PAGE));
  const paginatedUsers = sortedUsers.slice((currentPage - 1) * USERS_PER_PAGE, currentPage * USERS_PER_PAGE);

  // ── Ações ──────────────────────────────────────────────
  const togglePremium = async (u) => {
    const hasPremium = u.purchases && Object.keys(u.purchases).length > 0;
    const ref = doc(db, 'users', u.id);
    if (hasPremium) {
      await updateDoc(ref, { purchases: {} });
    } else {
      await setDoc(ref, {
        purchases: {
          proibidao: { deckId: 'proibidao', source: 'admin', couponCode: null, purchasedAt: serverTimestamp() },
        },
      }, { merge: true });
    }
    await logAction(hasPremium ? 'revoke_premium' : 'grant_premium', u.id);
    fetchAll();
  };

  const createCoupon = async () => {
    const code = newCode.trim().toUpperCase();
    if (!code) { setCreateMsg('Digite um código.'); return; }
    if (coupons.find(c => c.id === code)) { setCreateMsg('Esse código já existe.'); return; }
    setCreating(true);
    setCreateMsg('');
    try {
      const data = {
        code, deckId: newDeck,
        note: newNote.trim() || '',
        usedBy: null, usedAt: null,
        createdAt: serverTimestamp(),
      };
      if (newExpiry) data.expiresAt = Timestamp.fromDate(new Date(newExpiry + 'T23:59:59'));
      await setDoc(doc(db, 'coupons', code), data);
      await logAction('create_coupon', code);
      setNewCode(''); setNewNote(''); setNewExpiry('');
      setCreateMsg('✅ Cupom criado!');
      fetchAll();
    } catch {
      setCreateMsg('Erro ao criar cupom.');
    } finally {
      setCreating(false);
    }
  };

  const deleteCoupon = async (code) => {
    if (!window.confirm(`Deletar o cupom "${code}"?`)) return;
    await deleteDoc(doc(db, 'coupons', code));
    await logAction('delete_coupon', code);
    fetchAll();
  };

  const resetCoupon = async (code) => {
    await updateDoc(doc(db, 'coupons', code), { usedBy: null, usedAt: null });
    await logAction('reset_coupon', code);
    fetchAll();
  };

  // ── Export CSV ─────────────────────────────────────────
  const exportCSV = () => {
    const header = ['email', 'uid', 'premium', 'origem', 'cupom_usado', 'criado_em'];
    const rows = users.map(u => {
      const hasPremium = u.purchases && Object.keys(u.purchases).length > 0;
      const purchase = hasPremium ? Object.values(u.purchases)[0] : null;
      return [
        u.email || '', u.id,
        hasPremium ? 'sim' : 'não',
        purchase?.source || '',
        purchase?.couponCode || '',
        u.createdAt?.toDate?.()?.toISOString() || '',
      ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(',');
    });
    const csv = [header.join(','), ...rows].join('\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `usuarios_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ── Copy coupon ────────────────────────────────────────
  const copyCode = (code) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // ── Render ─────────────────────────────────────────────
  const tabs = [
    { id: 'overview', label: '📊 Visão geral' },
    { id: 'users', label: '👥 Usuários' },
    { id: 'coupons', label: '🎟️ Cupons' },
  ];

  const sortHeaderBtn = (field, label) => (
    <button onClick={() => toggleSort(field)} style={{
      background: sortField === field ? '#1a1a1a' : 'none',
      border: 'none', cursor: 'pointer',
      color: sortField === field ? C.ink : C.inkMuted,
      fontFamily: BODY, fontSize: '0.62rem', fontWeight: 700,
      letterSpacing: '0.1em', padding: '0.25rem 0.5rem',
      borderRadius: '6px',
    }}>
      {label}{arrow(field)}
    </button>
  );

  const filterBtn = (key, label) => (
    <button key={key} onClick={() => setStatusFilter(key)} style={{
      background: statusFilter === key ? C.ink : 'transparent',
      color: statusFilter === key ? '#000' : C.inkMuted,
      border: `1px solid ${statusFilter === key ? C.ink : C.border}`,
      borderRadius: '8px', padding: '0.3rem 0.75rem',
      fontFamily: BODY, fontSize: '0.72rem', fontWeight: 600,
      cursor: 'pointer', transition: 'all 0.15s',
    }}>
      {label}
    </button>
  );

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.ink, fontFamily: BODY }}>
      {/* Header */}
      <div style={{
        background: C.card, borderBottom: `1px solid ${C.border}`,
        padding: '1rem 2rem', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div style={{ fontSize: '1.2rem' }}>🛡️</div>
          <div style={{ fontFamily: TITLE, fontWeight: 900, fontSize: '1rem', letterSpacing: '-0.02em' }}>
            Admin · Eu Não Vou Me Expor
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ fontFamily: BODY, fontSize: '0.75rem', color: C.inkMuted }}>{user.email}</div>
          <Btn onClick={onLogout} bg="transparent" color={C.inkMuted} border={C.border} small>Sair</Btn>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: `1px solid ${C.border}`, padding: '0 2rem', display: 'flex', gap: '0.3rem' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            background: 'none', border: 'none',
            borderBottom: `2px solid ${tab === t.id ? C.ink : 'transparent'}`,
            color: tab === t.id ? C.ink : C.inkMuted,
            fontFamily: BODY, fontWeight: 600, fontSize: '0.82rem',
            padding: '0.8rem 1rem', cursor: 'pointer', transition: 'color 0.15s',
          }}>
            {t.label}
          </button>
        ))}
        <button onClick={fetchAll} style={{
          background: 'none', border: 'none', color: C.inkMuted,
          fontFamily: BODY, fontSize: '0.75rem', cursor: 'pointer',
          marginLeft: 'auto', padding: '0.8rem 0',
        }}>
          ↻ atualizar
        </button>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
        {loading ? (
          <div style={{ color: C.inkMuted, fontFamily: BODY, fontSize: '0.85rem' }}>Carregando...</div>
        ) : (
          <>
            {/* ── OVERVIEW ── */}
            {tab === 'overview' && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(155px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                  {[
                    { label: 'Usuários cadastrados', value: totalUsers, color: C.blue, big: true },
                    { label: 'Usuários premium', value: premiumUsers, color: C.green, big: true },
                    { label: 'Cupons criados', value: totalCoupons, color: C.ink, big: true },
                    { label: 'Cupons utilizados', value: usedCoupons, color: C.red, big: true },
                    { label: 'Receita estimada', value: estimatedRevenue, color: C.green, big: false },
                  ].map((s, i) => (
                    <div key={i} style={{ background: C.card, border: `1.5px solid ${C.border}`, borderRadius: '14px', padding: '1.2rem' }}>
                      <div style={{ fontFamily: BODY, fontSize: '0.62rem', color: C.inkMuted, fontWeight: 700, letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                        {s.label.toUpperCase()}
                      </div>
                      <div style={{ fontFamily: TITLE, fontWeight: 900, fontSize: s.big ? '2.5rem' : '1.4rem', color: s.color, letterSpacing: '-0.04em', lineHeight: 1 }}>
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
                      padding: '0.6rem 0', borderBottom: `1px solid ${C.border}`,
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

                {/* Log de ações */}
                <Card>
                  <SectionTitle>LOG DE AÇÕES (ÚLTIMAS 10)</SectionTitle>
                  {logs.length === 0 && (
                    <div style={{ color: C.inkMuted, fontSize: '0.82rem' }}>Nenhuma ação registrada ainda.</div>
                  )}
                  {logs.map(log => (
                    <div key={log.id} style={{
                      padding: '0.5rem 0', borderBottom: `1px solid ${C.border}`,
                    }}>
                      <div style={{ fontFamily: BODY, fontSize: '0.78rem', color: C.ink, fontWeight: 600 }}>
                        {actionLabel(log.action)}
                        <span style={{ color: C.inkMuted, fontWeight: 400, marginLeft: '0.4rem', fontSize: '0.72rem' }}>
                          {log.target}
                        </span>
                      </div>
                      <div style={{ fontFamily: BODY, fontSize: '0.62rem', color: C.inkMuted, marginTop: '0.15rem' }}>
                        {log.timestamp?.toDate?.()?.toLocaleString('pt-BR') ?? '—'}
                      </div>
                    </div>
                  ))}
                </Card>
              </div>
            )}

            {/* ── USUÁRIOS ── */}
            {tab === 'users' && (
              <div>
                {/* Toolbar */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '0.7rem', alignItems: 'center' }}>
                  <input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Buscar por email..."
                    style={{
                      flex: '1 1 200px', background: '#111', border: `1px solid ${C.border}`,
                      borderRadius: '10px', padding: '0.55rem 0.9rem',
                      color: C.ink, fontFamily: BODY, fontSize: '16px', outline: 'none',
                    }}
                  />
                  <button onClick={exportCSV} style={{
                    background: 'transparent', border: `1.5px solid ${C.border}`,
                    borderRadius: '10px', padding: '0.5rem 0.9rem',
                    color: C.inkMuted, fontFamily: BODY, fontSize: '0.72rem',
                    fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
                  }}>
                    ⬇ Exportar CSV
                  </button>
                </div>

                {/* Filtros de status */}
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.8rem' }}>
                  {filterBtn('all', 'Todos')}
                  {filterBtn('premium', 'Premium')}
                  {filterBtn('free', 'Free')}
                  {filterBtn('coupon', 'Com cupom')}
                </div>

                <Card>
                  {/* Contador */}
                  <div style={{ fontFamily: BODY, fontSize: '0.65rem', color: C.inkMuted, fontWeight: 700, letterSpacing: '0.15em', marginBottom: '0.7rem' }}>
                    {filteredUsers.length} DE {totalUsers} USUÁRIOS
                  </div>

                  {/* Cabeçalho ordenável */}
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0.2rem 0', borderBottom: `1px solid ${C.border}`,
                    marginBottom: '0.2rem',
                  }}>
                    {sortHeaderBtn('email', 'EMAIL')}
                    <div style={{ display: 'flex', gap: '0.2rem' }}>
                      {sortHeaderBtn('createdAt', 'CRIADO EM')}
                      {sortHeaderBtn('status', 'STATUS')}
                    </div>
                  </div>

                  {filteredUsers.length === 0 && (
                    <div style={{ color: C.inkMuted, fontSize: '0.82rem', padding: '1rem 0' }}>
                      Nenhum usuário encontrado.
                    </div>
                  )}

                  {paginatedUsers.map(u => {
                    const hasPremium = u.purchases && Object.keys(u.purchases).length > 0;
                    const purchase = hasPremium ? Object.values(u.purchases)[0] : null;
                    const isNew = u.createdAt?.toDate && (Date.now() - u.createdAt.toDate().getTime() < 86_400_000);

                    const src = (() => {
                      if (!purchase) return null;
                      if (purchase.source === 'admin') return { label: '⚙️ Admin', color: C.blue };
                      if (purchase.source === 'coupon') return { label: `🎟️ Cupom: ${purchase.couponCode || '—'}`, color: C.inkMuted };
                      if (purchase.source === 'mercadopago') return { label: '💳 Pagamento', color: C.green };
                      return { label: purchase.source, color: C.inkMuted };
                    })();

                    return (
                      <div key={u.id} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        flexWrap: 'wrap', gap: '0.5rem',
                        padding: '0.9rem 0', borderBottom: `1px solid ${C.border}`,
                      }}>
                        <div style={{ flex: 1, minWidth: '200px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                            <span style={{ fontFamily: BODY, fontWeight: 600, fontSize: '0.85rem', color: C.ink }}>
                              {u.displayName || '—'}
                            </span>
                            {isNew && (
                              <span style={{
                                background: `${C.green}22`, border: `1px solid ${C.green}55`,
                                borderRadius: '100px', padding: '0.1rem 0.45rem',
                                fontFamily: BODY, fontSize: '0.55rem', color: C.green, fontWeight: 700,
                              }}>
                                NOVO
                              </span>
                            )}
                          </div>
                          <div style={{ fontFamily: BODY, fontSize: '0.7rem', color: C.inkMuted }}>{u.email}</div>
                          {u.createdAt?.toDate && (
                            <div style={{ fontFamily: BODY, fontSize: '0.62rem', color: C.inkSoft, marginTop: '0.1rem' }}>
                              {u.createdAt.toDate().toLocaleDateString('pt-BR')}
                            </div>
                          )}
                          {hasPremium && src && (
                            <div style={{ fontFamily: BODY, fontSize: '0.65rem', color: src.color, marginTop: '0.2rem', fontWeight: 600 }}>
                              {src.label}
                            </div>
                          )}
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

                  {/* Paginação */}
                  {totalPages > 1 && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', paddingTop: '1rem' }}>
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        style={{
                          background: 'transparent',
                          border: `1px solid ${currentPage === 1 ? C.border : C.inkMuted}`,
                          borderRadius: '8px', padding: '0.35rem 0.8rem',
                          color: currentPage === 1 ? C.inkSoft : C.ink,
                          fontFamily: BODY, fontSize: '0.75rem',
                          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                        }}
                      >
                        ← Anterior
                      </button>
                      <span style={{ fontFamily: BODY, fontSize: '0.75rem', color: C.inkMuted }}>
                        Página {currentPage} de {totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        style={{
                          background: 'transparent',
                          border: `1px solid ${currentPage === totalPages ? C.border : C.inkMuted}`,
                          borderRadius: '8px', padding: '0.35rem 0.8rem',
                          color: currentPage === totalPages ? C.inkSoft : C.ink,
                          fontFamily: BODY, fontSize: '0.75rem',
                          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                        }}
                      >
                        Próxima →
                      </button>
                    </div>
                  )}
                </Card>
              </div>
            )}

            {/* ── CUPONS ── */}
            {tab === 'coupons' && (
              <div>
                {/* Criar novo */}
                <Card>
                  <SectionTitle>CRIAR CUPOM</SectionTitle>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '0.5rem' }}>
                    <input
                      value={newCode}
                      onChange={e => setNewCode(e.target.value.toUpperCase())}
                      placeholder="CÓDIGO (ex: AMIGO50)"
                      style={{
                        flex: '1 1 150px', background: '#111', border: `1px solid ${C.border}`,
                        borderRadius: '10px', padding: '0.65rem 0.9rem',
                        color: C.ink, fontFamily: BODY, fontSize: '16px',
                        outline: 'none', letterSpacing: '0.05em', fontWeight: 700,
                      }}
                    />
                    <input
                      value={newNote}
                      onChange={e => setNewNote(e.target.value)}
                      placeholder="Descrição (opcional)"
                      style={{
                        flex: '2 1 180px', background: '#111', border: `1px solid ${C.border}`,
                        borderRadius: '10px', padding: '0.65rem 0.9rem',
                        color: C.ink, fontFamily: BODY, fontSize: '16px', outline: 'none',
                      }}
                    />
                    <input
                      type="date"
                      value={newExpiry}
                      onChange={e => setNewExpiry(e.target.value)}
                      min={new Date().toISOString().slice(0, 10)}
                      title="Expira em (opcional)"
                      style={{
                        flex: '1 1 140px', background: '#111', border: `1px solid ${C.border}`,
                        borderRadius: '10px', padding: '0.65rem 0.9rem',
                        color: newExpiry ? C.ink : C.inkSoft, fontFamily: BODY, fontSize: '16px',
                        outline: 'none', colorScheme: 'dark',
                      }}
                    />
                    <Btn onClick={createCoupon} disabled={creating} bg={C.green} color="#000" border={C.green}>
                      {creating ? 'Criando...' : '+ Criar'}
                    </Btn>
                  </div>
                  <div style={{ fontFamily: BODY, fontSize: '0.62rem', color: C.inkSoft, marginBottom: '0.4rem' }}>
                    Data de expiração é opcional · cupons sem data não expiram
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
                  {coupons.map(c => {
                    const isExpired = c.expiresAt && c.expiresAt.toDate?.() < new Date();
                    return (
                      <div key={c.id} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        flexWrap: 'wrap', gap: '0.5rem',
                        padding: '0.8rem 0', borderBottom: `1px solid ${C.border}`,
                      }}>
                        <div style={{ flex: 1, minWidth: '180px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                            <span style={{ fontFamily: TITLE, fontWeight: 900, fontSize: '0.95rem', color: C.ink, letterSpacing: '0.03em' }}>
                              {c.code}
                            </span>
                            <button
                              onClick={() => copyCode(c.id)}
                              title="Copiar código"
                              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 0.15rem', fontSize: '0.85rem', lineHeight: 1 }}
                            >
                              {copiedCode === c.id ? '✓' : '📋'}
                            </button>
                            {copiedCode === c.id && (
                              <span style={{ fontFamily: BODY, fontSize: '0.6rem', color: C.green, fontWeight: 600 }}>Copiado!</span>
                            )}
                          </div>
                          <div style={{ fontFamily: BODY, fontSize: '0.7rem', color: C.inkMuted }}>{c.note || '—'}</div>
                          {c.expiresAt && (
                            <div style={{ fontFamily: BODY, fontSize: '0.62rem', color: isExpired ? C.red : C.inkSoft, marginTop: '0.1rem' }}>
                              {isExpired ? '⚠️ expirado em: ' : 'expira em: '}
                              {c.expiresAt.toDate?.()?.toLocaleDateString('pt-BR') ?? '—'}
                            </div>
                          )}
                          {c.usedBy && (
                            <div style={{ fontFamily: BODY, fontSize: '0.62rem', color: C.red, marginTop: '0.1rem' }}>
                              usado por: {c.usedBy.slice(0, 16)}…
                            </div>
                          )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {isExpired
                            ? <Badge label="EXPIRADO" color={C.red} />
                            : c.usedBy
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
                    );
                  })}
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
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const auth = getAuth();
    return onAuthStateChanged(auth, (u) => {
      setUser(u && u.email === ADMIN_EMAIL ? u : null);
    });
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

  if (!user) return <AdminLogin />;
  return <AdminPanel user={user} onLogout={handleLogout} />;
}

import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { useAuth } from './AuthContext';

// ============ BARALHO PROIBIDÃO +18 ============
const DECK_PROIBIDAO = {
  id: 'proibidao',
  name: 'Proibidão +18',
  emoji: '🔥',
  description: 'Perguntas +18 pra grupos sem vergonha',
  accentColor: '#9fff3d',
  freeCount: 0,
  totalCount: 41,
  price: 'R$ 9,99',
  cards: [
    // grátis (10)
    "Já transou em lugar público?",
    "Seria assistido com seu casal por alguém?",
    "Brincadeiras orais em locais públicos?",
    "Halls preto no oral?",
    "Já dormiu na hora H?",
    "Daria vale night?",
    "Pediria vale night?",
    "Já se filmou transando?",
    "Já usou fantasia?",
    "Tamanho importa?",
    // premium (31)
    "Assiste pornografia?",
    "Já perdeu o tesão/brozou na hora H?",
    "Preliminar — vermelho: metecão hard, preto: de luz acesa?",
    "Cuzinho é opção?",
    "Já fez BDSM?",
    "Engole?",
    "Gosta de ser enforcado(a)?",
    "Manda nudes?",
    "Beija pós oral?",
    "Gosta de ser submisso(a)?",
    "Soca fofo? Vermelho: faz amor, preto: faz sexo mais forte",
    "Já fez suruba ou ménage?",
    "Já beijou amigo(a) do mesmo sexo?",
    "Já beijou amigo(a) do sexo oposto?",
    "Já usou brinquedo sexual sozinho ou com alguém?",
    "Já beijou 2 ou mais pessoas da roda?",
    "Já fantasiou com conhecido(a)?",
    "Gosta de receber beijo grego?",
    "Gosta de fazer beijo grego?",
    "Seria marmita de algum casal?",
    "Teria uma marmita no casal?",
    "Já beijou o mesmo sexo?",
    "Já deu beijo triplo?",
    "Ménage com amigos?",
    "Filmaria o sexo por dinheiro?",
    "Mama se engasgando?",
    "Transa menstruada?",
    "Já fingiu orgasmo?",
    "Gosta de apanhar na cama?",
    "Abriria o relacionamento só para transar?",
  ]
};

const DECK_LOREM = {
  id: 'lorem',
  name: 'Lorem Ipsum',
  emoji: '🎲',
  description: 'Perguntas do cotidiano e comportamento',
  accentColor: '#7b87ff',
  freeCount: 5,
  totalCount: 20,
  price: 'R$ 7,99',
  cards: [
    "Quem aqui já mentiu pro grupo sobre onde estava?",
    "Qual o segredo mais inútil que você guarda?",
    "Já fingiu não ver a mensagem de alguém nesse grupo?",
    "Quem você menos confiaria com seu celular desbloqueado?",
    "Qual hábito seu envergonharia sua família?",
    "Já bisbilhotou o perfil de ex nessa semana?",
    "Qual app você deletaria se alguém visse seu celular agora?",
    "Já curtiu foto muito antiga de alguém sem querer?",
    "Quem aqui tem mais de 3 chats arquivados?",
    "Qual foi o último app que você abriu antes de dormir?",
    "Você já bloqueou alguém e se arrependeu?",
    "Qual notificação você mais ignora propositalmente?",
    "Já mandou print de conversa sem a pessoa saber?",
    "Quantas guias abertas você tem agora no celular?",
    "Qual o último meme que você salvou e nunca mandou?",
    "Já pesquisou o nome de alguém dessa sala no Google?",
    "Qual app você usa no banheiro mas nunca admite?",
    "Já fingiu bateria baixa pra sair de uma conversa?",
    "Você tem alguém salvo no celular com nome falso?",
    "Qual foto no seu rolo você deletaria agora se pudesse?",
  ]
};

const DECK_ROLE = {
  id: 'role',
  name: 'Rolê',
  emoji: '🍻',
  description: 'Perguntas pra animar qualquer rolê',
  accentColor: '#ffd43d',
  freeCount: 0,
  totalCount: 30,
  price: 'R$ 9,99',
  comingSoon: true,
  cards: [],
};

const DECK_GELO = {
  id: 'gelo',
  name: 'Quebrando o Gelo',
  emoji: '🤝',
  description: 'Perfeito pra quem ainda não se conhece',
  accentColor: '#3dffd4',
  freeCount: 0,
  totalCount: 30,
  price: 'R$ 9,99',
  comingSoon: true,
  cards: [],
};

const DECK_ENGRACADOS = {
  id: 'engracados',
  name: 'Engraçados',
  emoji: '😂',
  description: 'Perguntas pra rir até chorar',
  accentColor: '#ff9a3d',
  freeCount: 0,
  totalCount: 30,
  price: 'R$ 9,99',
  comingSoon: true,
  cards: [],
};

const DECK_AVENTURA = {
  id: 'aventura',
  name: 'Aventura',
  emoji: '🏕️',
  description: 'Desafios e perguntas pra quem é corajoso',
  accentColor: '#c87bff',
  freeCount: 0,
  totalCount: 30,
  price: 'R$ 9,99',
  comingSoon: true,
  cards: [],
};

const ALL_DECKS = [DECK_PROIBIDAO, DECK_LOREM, DECK_ROLE, DECK_GELO, DECK_ENGRACADOS, DECK_AVENTURA];

// ============ TOKENS ============
const C = {
  bg: '#000000', card: '#0c0c0c', ink: '#ffffff',
  inkMuted: '#aaaaaa',  // era #555 — contraste 7:1 ✓
  inkSoft: '#888888',   // era #888 — usado só em elementos secundários grandes
  border: '#2e2e2e',    // era #1e1e1e — um pouco mais visível
  green: '#9fff3d', greenGlow: '#9fff3d44',
  red: '#ff3d5a', redGlow: '#ff3d5a44',
  blue: '#7b87ff', blueGlow: '#7b87ff44',
};
const R = 22;
const TITLE = '"Archivo", sans-serif';
const BODY = '"Inter", sans-serif';
const FONT_URL = 'https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;700;900&family=Inter:wght@300;400;500;600&display=swap&font-display=swap';

// ============ UTILS ============
const shuffle = arr => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// ============ COMPONENTES BASE ============

// Layout padrão de todas as telas:
// - Fundo preto fixo, sem scroll de página
// - Header fixo no topo (back + label + home)
// - Área de conteúdo scrollável no meio
// - CTA sempre colado no bottom
function AppShell({ onBack, onHome, label, cta, children, onExample }) {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: C.bg, display: 'flex', flexDirection: 'column',
      maxWidth: '480px', margin: '0 auto',
    }}>
      {/* Header fixo */}
      <div style={{
        flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '3rem 1.4rem 0.8rem', background: C.bg,
        position: 'relative',
      }}>
        <div style={{ width: '70px' }}>
          {onBack
            ? <button onClick={onBack} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: C.inkSoft, display: 'flex', alignItems: 'center',
                gap: '0.4rem', fontFamily: BODY, fontSize: '0.85rem', fontWeight: 500, padding: 0
              }}>
                <span style={{ fontSize: '1.1rem' }}>←</span> Voltar
              </button>
            : null}
        </div>
        {label && (
          <div style={{
            position: 'absolute', left: '50%', transform: 'translateX(-50%)',
            fontFamily: BODY, fontSize: '0.68rem', color: C.inkMuted,
            fontWeight: 600, letterSpacing: '0.15em', pointerEvents: 'none'
          }}>
            {label}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '70px', justifyContent: 'flex-end' }}>
          {onExample && (
            <button onClick={onExample} style={{
              background: 'transparent', border: `1px solid ${C.border}`,
              borderRadius: '100px', width: '24px', height: '24px',
              cursor: 'pointer', color: C.inkMuted,
              fontFamily: BODY, fontSize: '0.75rem', fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0
            }}>?</button>
          )}
          {onHome
            ? <button onClick={onHome} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: C.inkSoft, fontSize: '1.2rem', padding: '0.2rem'
              }}>⌂</button>
            : null}
        </div>
      </div>

      {/* Conteúdo scrollável */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '0.5rem 1.4rem 0',
        WebkitOverflowScrolling: 'touch',
      }}>
        {children}
      </div>

      {/* CTA fixo no bottom */}
      {cta && (
        <div style={{
          flexShrink: 0,
          padding: '0.8rem 1.4rem 1.4rem',
          background: C.bg,
        }}>
          {cta}
        </div>
      )}
    </div>
  );
}

// Screen legado — mantido para compatibilidade mas usa AppShell internamente
function Screen({ children }) {
  return (
    <div style={{
      minHeight: '100vh', background: C.bg,
      padding: '0 1.4rem 5rem',
      maxWidth: '480px', margin: '0 auto',
    }}>
      {children}
    </div>
  );
}

function Tagline({ style = {} }) {
  return (
    <div style={{
      fontFamily: BODY, fontSize: '0.68rem', color: C.inkMuted,
      letterSpacing: '0.04em', textAlign: 'center', ...style
    }}>
      mas eu não vou me expor
    </div>
  );
}

function RoundBadge({ round, current, total }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      marginBottom: '1rem'
    }}>
      <div style={{
        background: '#111', border: `1px solid ${C.border}`,
        borderRadius: '100px', padding: '0.3rem 0.85rem',
        fontFamily: BODY, fontSize: '0.68rem', color: C.inkSoft,
        fontWeight: 600, letterSpacing: '0.12em'
      }}>
        RODADA {round}
      </div>
      {current !== undefined && (
        <div style={{ fontFamily: BODY, fontSize: '0.68rem', color: C.inkMuted, fontWeight: 500 }}>
          {current + 1} / {total}
        </div>
      )}
    </div>
  );
}

function Btn({ children, onClick, color = C.ink, bg = '#111', border = C.border, disabled, style = {} }) {
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseDown={e => !disabled && (e.currentTarget.style.transform = 'scale(0.97)')}
      onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
      style={{
        width: '100%', padding: '1.05rem',
        background: bg, border: `1.5px solid ${border}`,
        borderRadius: `${R - 4}px`, color,
        fontFamily: TITLE, fontWeight: 700, fontSize: '1rem',
        letterSpacing: '-0.01em',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.35 : 1,
        transition: 'transform 0.15s ease', ...style
      }}>
      {children}
    </button>
  );
}

function VoteBtn({ label, color, glow, onClick }) {
  return (
    <button onClick={onClick}
      onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.97)')}
      onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
      style={{
        width: '100%', padding: '2rem 1rem',
        background: C.card, border: `2px solid ${color}`,
        borderRadius: `${R}px`, color,
        fontFamily: TITLE, fontWeight: 900, fontSize: '3.5rem',
        letterSpacing: '-0.02em', cursor: 'pointer',
        transition: 'transform 0.15s ease',
        boxShadow: `0 0 24px ${glow}`, lineHeight: 1
      }}>
      {label}
    </button>
  );
}

function PinInput({ value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center' }}>
      {[0, 1, 2].map(i => (
        <input key={i} id={`pin-${i}`}
          inputMode="numeric" pattern="[0-9]*" maxLength={1}
          value={value[i] || ''}
          autoFocus={i === 0 && value.length === 0}
          onChange={e => {
            const d = e.target.value.replace(/\D/g, '').slice(-1);
            const next = (value.slice(0, i) + d + value.slice(i + 1)).slice(0, 3);
            onChange(next);
            if (d && i < 2) document.getElementById(`pin-${i + 1}`)?.focus();
          }}
          onKeyDown={e => {
            if (e.key === 'Backspace' && !value[i] && i > 0)
              document.getElementById(`pin-${i - 1}`)?.focus();
          }}
          onFocus={e => (e.target.style.borderColor = C.ink)}
          onBlur={e => (e.target.style.borderColor = C.border)}
          style={{
            width: '4.5rem', height: '5.5rem',
            background: C.card, border: `1.5px solid ${C.border}`,
            borderRadius: `${R - 6}px`, color: C.ink,
            fontSize: '2.5rem', textAlign: 'center',
            fontFamily: TITLE, fontWeight: 900,
            outline: 'none', caretColor: C.green, transition: 'border-color 0.2s'
          }}
        />
      ))}
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)',
      backdropFilter: 'blur(10px)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1.5rem'
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#0c0c0c', border: `1.5px solid ${C.border}`,
        borderRadius: `${R}px`, padding: '2rem 1.5rem',
        maxWidth: '400px', width: '100%'
      }}>
        {children}
      </div>
    </div>
  );
}

// ============ TELA: SELEÇÃO DE BARALHOS ============
function DeckSelect({ onNext, onTutorial }) {
  const [selected, setSelected] = useState([]);
  const [buyDeck, setBuyDeck] = useState(null);
  const { hasExtension } = useAuth();

  const hasExt = (deck) => hasExtension(deck.id);

  const toggle = (id) => {
    const deck = ALL_DECKS.find(d => d.id === id);
    if (deck.comingSoon) return;
    if (deck.freeCount === 0 && !hasExt(deck)) { setBuyDeck(deck); return; }
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const selDecks = ALL_DECKS.filter(d => selected.includes(d.id));
  const n = selDecks.length;

  let ctaLabel, ctaBg, ctaColor;
  if (n === 0) {
    ctaLabel = 'ESCOLHA UM BARALHO'; ctaBg = '#1a1a1a'; ctaColor = '#444';
  } else if (n === 1) {
    const d = selDecks[0];
    ctaLabel = hasExt(d) ? `JOGAR ${d.name.toUpperCase()} →` : 'JOGAR VERSÃO GRÁTIS →';
    ctaBg = d.accentColor; ctaColor = '#000';
  } else {
    const anyExt = selDecks.some(d => hasExt(d));
    ctaLabel = anyExt ? `JOGAR COM ${n} BARALHOS →` : `JOGAR VERSÃO GRÁTIS (${n}) →`;
    ctaBg = `linear-gradient(90deg, ${selDecks[0].accentColor} 0%, ${selDecks[selDecks.length - 1].accentColor} 100%)`;
    ctaColor = '#000';
  }

  return (
    <AppShell
      cta={
        <button onClick={() => onNext(selected)} disabled={n === 0} style={{
          width: '100%', padding: '1.05rem', background: ctaBg, border: 'none',
          borderRadius: `${R - 4}px`, color: ctaColor,
          fontFamily: TITLE, fontWeight: 900, fontSize: '0.95rem',
          letterSpacing: '-0.01em', cursor: n === 0 ? 'not-allowed' : 'pointer',
        }}>
          {ctaLabel}
        </button>
      }
    >
      <div style={{ paddingTop: '0.5rem', paddingBottom: '0.5rem', textAlign: 'center' }}>
        <div style={{ fontFamily: TITLE, fontWeight: 900, fontSize: 'clamp(1.6rem, 6vw, 2.2rem)', letterSpacing: '-0.03em', color: C.ink, lineHeight: 0.95, marginBottom: '0.3rem' }}>
          EU NÃO VOU<br />ME EXPOR
        </div>
        <div style={{ fontFamily: BODY, fontSize: '0.68rem', color: C.inkMuted, letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
          mas eu não vou me expor
        </div>
        <button onClick={onTutorial} style={{ background: 'transparent', border: `1px solid ${C.border}`, borderRadius: '100px', padding: '0.25rem 0.9rem', cursor: 'pointer', fontFamily: BODY, fontSize: '0.65rem', color: C.inkMuted, fontWeight: 600, letterSpacing: '0.1em' }}>
          como jogar?
        </button>
      </div>

      <div style={{ fontFamily: BODY, fontSize: '0.62rem', color: C.inkMuted, fontWeight: 700, letterSpacing: '0.15em', margin: '0.8rem 0' }}>
        ESCOLHA OS BARALHOS
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.6rem', marginBottom: '0.8rem' }}>
        {ALL_DECKS.map(deck => {
          const isSelected = selected.includes(deck.id);
          const ext = hasExt(deck);
          const free = deck.freeCount > 0;
          const unlocked = free || ext;
          const accent = deck.accentColor;

          if (deck.comingSoon) {
            return (
              <div key={deck.id} style={{
                height: '180px', background: '#0c0c0c',
                border: `2px solid ${C.border}`,
                borderRadius: `${R - 4}px`, padding: '0.75rem',
                cursor: 'default', opacity: 0.4,
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '1.6rem', lineHeight: 1 }}>{deck.emoji}</span>
                  <span style={{
                    background: '#1a1a1a', border: `1px solid ${C.border}`,
                    borderRadius: '4px', padding: '0.1rem 0.4rem',
                    fontFamily: BODY, fontSize: '0.5rem', color: C.inkMuted,
                    fontWeight: 700, letterSpacing: '0.08em',
                  }}>EM BREVE</span>
                </div>
                <div>
                  <div style={{ fontFamily: TITLE, fontWeight: 900, fontSize: '0.82rem', color: C.ink, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '0.25rem' }}>
                    {deck.name}
                  </div>
                  <div style={{ fontFamily: BODY, fontSize: '0.6rem', color: '#666', lineHeight: 1.35 }}>
                    {deck.description}
                  </div>
                </div>
                <div style={{ fontFamily: BODY, fontSize: '0.6rem', color: C.inkSoft }}>{deck.totalCount} cartas · {deck.price}</div>
              </div>
            );
          }

          const cardBg = isSelected
            ? (accent === C.green ? '#0f1a08' : accent === C.blue ? '#0d0e1f' : `${accent}12`)
            : '#0c0c0c';

          return (
            <div key={deck.id} onClick={() => toggle(deck.id)} style={{
              height: '180px', background: cardBg,
              border: `2px solid ${isSelected ? accent : C.border}`,
              borderRadius: `${R - 4}px`, padding: '0.75rem',
              cursor: 'pointer', opacity: unlocked ? 1 : 0.6,
              transition: 'border-color 0.2s, background 0.2s, opacity 0.2s',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            }}>
              {/* Topo */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.6rem', lineHeight: 1 }}>{deck.emoji}</span>
                {unlocked ? (
                  <div style={{
                    width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0,
                    background: isSelected ? accent : 'transparent',
                    border: `2px solid ${isSelected ? accent : C.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}>
                    {isSelected && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                ) : (
                  <span style={{ fontSize: '0.9rem', lineHeight: 1 }}>🔒</span>
                )}
              </div>

              {/* Meio: nome + descrição */}
              <div>
                <div style={{ fontFamily: TITLE, fontWeight: 900, fontSize: '0.82rem', color: C.ink, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '0.25rem' }}>
                  {deck.name}
                </div>
                <div style={{ fontFamily: BODY, fontSize: '0.6rem', color: '#666', lineHeight: 1.35 }}>
                  {deck.description}
                </div>
              </div>

              {/* Rodapé: barra + ação */}
              <div onClick={e => e.stopPropagation()}>
                {free && (
                  <div style={{ height: '2px', background: '#1a1a1a', borderRadius: '1px', overflow: 'hidden', marginBottom: '0.4rem' }}>
                    <div style={{ width: ext ? '100%' : `${(deck.freeCount / deck.totalCount) * 100}%`, height: '100%', background: unlocked ? accent : '#333', borderRadius: '1px' }} />
                  </div>
                )}
                {ext ? (
                  <div style={{ fontFamily: BODY, fontSize: '0.6rem', fontWeight: 700, color: accent }}>✓ completo</div>
                ) : free ? (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: BODY, fontSize: '0.6rem', color: C.green, fontWeight: 700 }}>{deck.freeCount} grátis</span>
                    <button onClick={() => setBuyDeck(deck)} style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', fontFamily: BODY, fontSize: '0.6rem', fontWeight: 700, color: accent, textDecoration: 'underline' }}>
                      COMPRAR
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: TITLE, fontWeight: 900, fontSize: '0.7rem', color: '#666' }}>{deck.price}</span>
                    <button onClick={() => setBuyDeck(deck)} style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', fontFamily: BODY, fontSize: '0.6rem', fontWeight: 700, color: accent, textDecoration: 'underline' }}>
                      DETALHES
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ fontFamily: BODY, fontSize: '0.62rem', color: C.inkMuted, textAlign: 'center', marginBottom: '0.5rem' }}>
        toque para selecionar · pode misturar vários
      </div>

      {buyDeck && <DeckBuySheet deck={buyDeck} onClose={() => setBuyDeck(null)} />}
    </AppShell>
  );
}

// ============ BOTTOM SHEET DE COMPRA POR BARALHO (com Mercado Pago) ============
function DeckBuySheet({ deck, onClose }) {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState(false);
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingCoupon, setLoadingCoupon] = useState(false);
  const [loadingBuy, setLoadingBuy] = useState(false);
  const { user, signInWithGoogle, redeemCoupon: redeemCouponFirebase } = useAuth();

  const accent = deck.accentColor;
  const premiumCount = deck.totalCount - deck.freeCount;
  const hasCards = deck.cards.length > 0;
  const sampleFree = deck.cards.slice(0, 1);
  const samplePremium = deck.cards.slice(deck.freeCount, deck.freeCount + 2);
  const samples = [...sampleFree, ...samplePremium];

  const handleLogin = async () => {
    setLoadingLogin(true);
    try { await signInWithGoogle(); } catch (e) {} finally { setLoadingLogin(false); }
  };

  const handleBuy = async () => {
    if (!user) { await handleLogin(); return; }
    setLoadingBuy(true);
    try {
      const res = await fetch('/api/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: user.uid, deckId: deck.id }),
      });
      const data = await res.json();
      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        console.error('[handleBuy] sem init_point:', data);
      }
    } catch (e) {
      console.error('[handleBuy] erro:', e);
    } finally {
      setLoadingBuy(false);
    }
  };

  const handleCoupon = async () => {
    if (!user) { setCouponError('Faça login primeiro.'); return; }
    setLoadingCoupon(true);
    try {
      await redeemCouponFirebase(couponInput.trim(), deck.id);
      setCouponSuccess(true); setCouponError('');
      setTimeout(() => onClose(), 1400);
    } catch (e) { setCouponError(e.message); } finally { setLoadingCoupon(false); }
  };

  return ReactDOM.createPortal(
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div onClick={e => { e.stopPropagation(); e.nativeEvent?.stopImmediatePropagation?.(); }} style={{ background: '#0c0c0c', borderRadius: `${R}px ${R}px 0 0`, border: `1.5px solid ${C.border}`, borderBottom: 'none', padding: '1.2rem 1.3rem 1.8rem', width: '100%', maxWidth: '480px', maxHeight: '88vh', overflowY: 'auto' }}>
        <div style={{ width: '2rem', height: '3px', background: '#333', borderRadius: '2px', margin: '0 auto 1.2rem' }} />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '1.8rem', lineHeight: 1 }}>{deck.emoji}</span>
          <div>
            <div style={{ fontFamily: TITLE, fontWeight: 900, fontSize: '1.2rem', color: C.ink, letterSpacing: '-0.02em', lineHeight: 1 }}>{deck.name}</div>
            <div style={{ fontFamily: BODY, fontSize: '0.68rem', color: C.inkMuted, marginTop: '0.15rem' }}>{deck.description}</div>
          </div>
        </div>

        {/* Preço */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', margin: '0.9rem 0 0.8rem' }}>
          <div style={{ fontFamily: TITLE, fontWeight: 900, fontSize: '2rem', color: accent, letterSpacing: '-0.03em', lineHeight: 1 }}>{deck.price}</div>
          <div style={{ fontFamily: BODY, fontSize: '0.7rem', color: C.inkMuted }}>pagamento único · {deck.totalCount} cartas</div>
        </div>

        {/* Exemplos — só se o deck tiver cartas */}
        {hasCards ? (
          <>
            <div style={{ fontFamily: BODY, fontSize: '0.6rem', color: C.inkMuted, fontWeight: 700, letterSpacing: '0.12em', marginBottom: '0.5rem' }}>EXEMPLOS DO BARALHO</div>
            <div style={{ background: '#111', border: `1px solid ${C.border}`, borderRadius: '12px', padding: '0.6rem 0.8rem', marginBottom: '1rem' }}>
              {samples.map((q, i) => {
                const isPremiumQ = i > 0;
                const text = typeof q === 'object' ? q.text : q;
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', paddingTop: i > 0 ? '0.45rem' : 0, marginTop: i > 0 ? '0.45rem' : 0, borderTop: i > 0 ? `1px solid ${C.border}` : 'none' }}>
                    <span style={{ fontSize: '0.65rem', flexShrink: 0 }}>{isPremiumQ ? '🔥' : '🆓'}</span>
                    <span style={{ fontFamily: BODY, fontSize: '0.75rem', color: isPremiumQ ? C.inkMuted : C.ink, lineHeight: 1.3, flex: 1 }}>{text}</span>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div style={{ background: '#111', border: `1px solid ${C.border}`, borderRadius: '12px', padding: '0.9rem', marginBottom: '1rem', textAlign: 'center' }}>
            <div style={{ fontFamily: BODY, fontSize: '0.75rem', color: C.inkMuted, lineHeight: 1.5 }}>
              Baralho completo com {deck.totalCount} cartas. Em breve disponível para compra.
            </div>
          </div>
        )}

        {/* Resumo */}
        <div style={{ background: '#111', border: `1px solid ${C.border}`, borderRadius: `${R - 6}px`, padding: '0.75rem 1rem', marginBottom: '1rem' }}>
          {deck.freeCount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ fontFamily: BODY, fontSize: '0.72rem', color: C.inkSoft }}>{deck.freeCount} cartas grátis</span>
              <span style={{ fontFamily: BODY, fontSize: '0.72rem', color: C.green, fontWeight: 700 }}>incluso</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
            <span style={{ fontFamily: BODY, fontSize: '0.72rem', color: C.inkSoft }}>{premiumCount} cartas</span>
            <span style={{ fontFamily: BODY, fontSize: '0.72rem', color: C.ink, fontWeight: 700 }}>desbloqueadas</span>
          </div>
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: '0.6rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: BODY, fontSize: '0.8rem', color: C.ink, fontWeight: 700 }}>Total</span>
            <span style={{ fontFamily: TITLE, fontWeight: 900, fontSize: '1.2rem', color: accent, letterSpacing: '-0.02em' }}>{deck.price}</span>
          </div>
        </div>

        {/* Botão Comprar — Mercado Pago real */}
        <button onClick={handleBuy} disabled={loadingBuy} style={{ width: '100%', background: accent, border: 'none', borderRadius: `${R - 6}px`, padding: '1rem', cursor: loadingBuy ? 'not-allowed' : 'pointer', marginBottom: '0.75rem', opacity: loadingBuy ? 0.7 : 1 }}>
          <div style={{ fontFamily: TITLE, fontWeight: 900, fontSize: '1rem', color: '#000' }}>
            {loadingBuy ? 'Redirecionando...' : `Comprar agora · ${deck.price}`}
          </div>
          <div style={{ fontFamily: BODY, fontSize: '0.65rem', color: 'rgba(0,0,0,0.5)', marginTop: '0.1rem' }}>pix · cartão · Mercado Pago</div>
        </button>

        {/* Login Google */}
        {!user ? (
          <button onClick={handleLogin} disabled={loadingLogin} style={{ width: '100%', background: '#fff', border: 'none', borderRadius: `${R - 6}px`, padding: '0.8rem', cursor: 'pointer', marginBottom: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', opacity: loadingLogin ? 0.7 : 1 }}>
            <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16 19 12 24 12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.1l-6.2-5.2C29.3 35.5 26.8 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.4 4.3-4.4 5.7l6.2 5.2C36.9 40.1 44 35 44 24c0-1.3-.1-2.6-.4-3.9z"/></svg>
            <span style={{ fontFamily: BODY, fontWeight: 700, fontSize: '0.85rem', color: '#222' }}>{loadingLogin ? 'Entrando...' : 'Entrar com Google para usar cupom'}</span>
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.7rem', padding: '0.5rem 0.7rem', background: '#111', borderRadius: '10px', border: `1px solid ${C.border}` }}>
            <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: '#000', fontWeight: 700, flexShrink: 0 }}>
              {user.displayName?.[0] || user.email?.[0] || '?'}
            </div>
            <div style={{ fontFamily: BODY, fontSize: '0.7rem', color: C.inkMuted, overflow: 'hidden' }}>
              <div style={{ color: C.ink, fontWeight: 600, fontSize: '0.72rem' }}>{user.displayName || 'Logado'}</div>
              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
            </div>
          </div>
        )}

        {/* Cupom */}
        {user && (
          <div style={{ marginBottom: '0.6rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input value={couponInput} onChange={e => { setCouponInput(e.target.value); setCouponError(''); }} placeholder="Tem um cupom?" style={{ flex: 1, background: '#111', border: `1px solid ${C.border}`, borderRadius: '10px', padding: '0.6rem 0.9rem', color: C.ink, fontFamily: BODY, fontSize: '0.82rem', outline: 'none' }} />
              <button onClick={handleCoupon} disabled={loadingCoupon} style={{ background: 'transparent', border: `1px solid ${C.border}`, borderRadius: '10px', padding: '0.6rem 1rem', color: C.ink, fontFamily: BODY, fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', opacity: loadingCoupon ? 0.6 : 1 }}>
                {loadingCoupon ? '...' : 'Aplicar'}
              </button>
            </div>
            {couponError && <div style={{ fontFamily: BODY, fontSize: '0.68rem', color: C.red, marginTop: '0.35rem' }}>{couponError}</div>}
            {couponSuccess && <div style={{ fontFamily: BODY, fontSize: '0.68rem', color: accent, marginTop: '0.35rem', fontWeight: 600 }}>✓ Cupom aplicado! Baralho desbloqueado.</div>}
          </div>
        )}

        <div style={{ textAlign: 'center', fontFamily: BODY, fontSize: '0.6rem', color: C.inkMuted }}>
          compra única · disponível em todos seus dispositivos
        </div>
      </div>
    </div>,
    document.body
  );
}

// ============ TELA 1: SETUP (baralho + jogadores) ============
function SetupCount({ onNext, onTutorial, onBack }) {
  const [count, setCount] = useState(4);

  const cta = (
    <Btn onClick={() => onNext(count)} color={C.bg} bg={C.ink} border={C.ink}>
      Continuar
    </Btn>
  );

  return (
    <AppShell onBack={onBack} label="JOGADORES" cta={cta}>
      <div style={{ fontFamily: BODY, fontSize: '0.62rem', color: C.inkMuted, fontWeight: 700, letterSpacing: '0.15em', marginBottom: '0.7rem', textAlign: 'center' }}>
        QUANTOS JOGADORES?
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem' }}>
        <button onClick={() => setCount(Math.max(3, count - 1))} style={{
          width: '2.5rem', height: '2.5rem', borderRadius: '50%',
          background: 'transparent', border: `1.5px solid ${C.border}`,
          color: C.inkSoft, fontSize: '1.3rem', cursor: 'pointer', lineHeight: 1
        }}>−</button>
        <div style={{
          fontFamily: TITLE, fontWeight: 900,
          fontSize: 'clamp(3rem, 10vw, 4.5rem)',
          color: C.ink, lineHeight: 1, minWidth: '3rem',
          textAlign: 'center', letterSpacing: '-0.04em'
        }}>
          {count}
        </div>
        <button onClick={() => setCount(Math.min(20, count + 1))} style={{
          width: '2.5rem', height: '2.5rem', borderRadius: '50%',
          background: 'transparent', border: `1.5px solid ${C.border}`,
          color: C.inkSoft, fontSize: '1.3rem', cursor: 'pointer', lineHeight: 1
        }}>+</button>
      </div>
      <div style={{ textAlign: 'center', fontFamily: BODY, fontSize: '0.62rem', color: C.inkMuted, marginTop: '0.6rem' }}>
        mín. 3 · máx. 20
      </div>
    </AppShell>
  );
}


// ============ TELA 2: SETUP NAMES ============
function SetupNames({ initialCount, onNext, onBack }) {
  const [names, setNames] = useState(Array(initialCount).fill(''));

  const addPlayer = () => {
    if (names.length < 20) setNames([...names, '']);
  };
  const removePlayer = (i) => {
    if (names.length > 3) setNames(names.filter((_, idx) => idx !== i));
  };
  const updateName = (i, val) => {
    const copy = [...names];
    copy[i] = val;
    setNames(copy);
  };

  const allFilled = names.every(n => n.trim().length > 0);

  const cta2 = (
    <Btn onClick={() => onNext(names.map(n => n.trim()))} disabled={!allFilled} color={C.bg} bg={C.ink} border={C.ink}>
      Começar jogo
    </Btn>
  );

  return (
    <AppShell onBack={onBack} cta={cta2}>
      <div style={{ marginBottom: '1.2rem', paddingTop: '0.3rem' }}>
        <div style={{
          fontFamily: TITLE, fontWeight: 900, fontSize: '2rem',
          color: C.ink, letterSpacing: '-0.03em', marginBottom: '0.3rem'
        }}>
          Os jogadores
        </div>
        <div style={{ fontFamily: BODY, fontSize: '0.82rem', color: C.inkMuted }}>
          coloca o nome de cada um
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        {names.map((n, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center',
            gap: '0.8rem', marginBottom: '0.5rem'
          }}>
            <div style={{
              fontFamily: TITLE, fontWeight: 900, color: C.inkMuted,
              fontSize: '0.9rem', minWidth: '1.8rem', letterSpacing: '-0.02em'
            }}>
              {String(i + 1).padStart(2, '0')}
            </div>
            <input
              value={n}
              onChange={e => updateName(i, e.target.value)}
              placeholder="nome..."
              maxLength={20}
              onFocus={e => (e.target.style.borderBottomColor = C.ink)}
              onBlur={e => (e.target.style.borderBottomColor = C.border)}
              style={{
                flex: 1, background: 'transparent',
                border: 'none', borderBottom: `1px solid ${C.border}`,
                color: C.ink, fontSize: '1.05rem',
                padding: '0.65rem 0',
                fontFamily: TITLE, fontWeight: 700,
                outline: 'none', letterSpacing: '-0.01em',
                transition: 'border-color 0.2s'
              }}
            />
            {names.length > 3 && (
              <button onClick={() => removePlayer(i)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: C.inkMuted, fontSize: '1.1rem', padding: '0.2rem',
                lineHeight: 1, flexShrink: 0
              }}>✕</button>
            )}
          </div>
        ))}
      </div>

      {names.length < 20 && (
        <button onClick={addPlayer} style={{
          width: '100%', padding: '0.75rem',
          background: 'transparent', border: `1px dashed ${C.border}`,
          borderRadius: `${R - 6}px`, color: C.inkSoft,
          fontFamily: BODY, fontWeight: 500, fontSize: '0.85rem',
          cursor: 'pointer', marginBottom: '1.5rem', letterSpacing: '0.02em'
        }}>
          + adicionar jogador
        </button>
      )}

    </AppShell>
  );
}

// ============ TELA 3: CARTA ============
function CardReveal({ question, round, deckEmoji, deckAccent, totalDecks, onStart, onHome, onSkip, onExample }) {
  const showTag = totalDecks > 1 && deckEmoji;
  return (
    <AppShell
      onHome={onHome}
      label={`RODADA ${round}`}
      onExample={onExample}
      onExample={onExample}
      cta={<Btn onClick={onStart} color={C.bg} bg={C.ink} border={C.ink}>Começar</Btn>}
    >
      {/* Botão pular — pill branca, alinhada à direita */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.6rem' }}>
        <button onClick={onSkip} style={{
          background: C.ink, border: 'none',
          borderRadius: '100px', padding: '0.3rem 0.85rem',
          display: 'flex', alignItems: 'center', gap: '0.3rem',
          cursor: 'pointer'
        }}>
          <span style={{
            fontFamily: BODY, fontSize: '0.65rem',
            color: C.bg, fontWeight: 700, letterSpacing: '0.08em'
          }}>PULAR</span>
          <span style={{ fontSize: '0.7rem', color: C.bg }}>→</span>
        </button>
      </div>

      <div style={{
        background: C.card, border: `1.5px solid ${C.ink}`,
        borderRadius: `${R}px`, padding: '2rem 1.5rem',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        flex: 1, minHeight: '55vh'
      }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{
            display: 'inline-flex', width: '28px', height: '28px',
            border: `1px solid ${C.border}`, borderRadius: '50%',
            alignItems: 'center', justifyContent: 'center',
            color: C.inkMuted, fontSize: '0.7rem'
          }}>✦</div>
        </div>
        {showTag && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
              background: `${deckAccent}18`, border: `1px solid ${deckAccent}44`,
              borderRadius: '100px', padding: '0.2rem 0.7rem',
              fontFamily: BODY, fontSize: '0.6rem', fontWeight: 700, color: deckAccent,
              letterSpacing: '0.06em'
            }}>
              {deckEmoji}
            </div>
          </div>
        )}
        <div style={{
          fontFamily: TITLE, fontWeight: 900, fontSize: '2rem',
          color: C.ink, letterSpacing: '-0.03em', lineHeight: 1.1,
          textAlign: 'center', padding: '1.5rem 0'
        }}>
          {question}
        </div>
        <Tagline />
      </div>
    </AppShell>
  );
}

// ============ TELA 4: VOTO ESCOLHA ============
function PlayerVoteChoice({ question, round, playerName, playerIndex, totalPlayers, activePlayers, onChoose, onHome, onPlayerLeft, onExample }) {
  const [leftPopup, setLeftPopup] = useState(false);

  return (
    <AppShell
      onHome={onHome}
      label={`RODADA ${round}`}
      cta={
        <button onClick={() => setLeftPopup(true)} style={{
          width: '100%', padding: '0.65rem',
          background: 'transparent', border: `1px solid ${C.border}`,
          borderRadius: `${R - 4}px`, color: C.inkMuted,
          fontFamily: BODY, fontWeight: 500, fontSize: '0.78rem',
          cursor: 'pointer', letterSpacing: '0.02em'
        }}>
          Jogador saiu do jogo
        </button>
      }
    >
      <RoundBadge round={round} current={playerIndex} total={totalPlayers} />
      <div style={{
        fontFamily: TITLE, fontWeight: 900, fontSize: '2.2rem',
        color: C.ink, letterSpacing: '-0.03em',
        marginBottom: '0.4rem', wordBreak: 'break-word'
      }}>
        {playerName}
      </div>
      <div style={{
        fontFamily: BODY, fontSize: '0.88rem', color: C.inkSoft,
        marginBottom: '1.5rem', lineHeight: 1.4
      }}>
        {question}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        <VoteBtn label="SIM" color={C.green} glow={C.greenGlow} onClick={() => onChoose('yes')} />
        <VoteBtn label="NÃO" color={C.red} glow={C.redGlow} onClick={() => onChoose('no')} />
      </div>
      <Tagline style={{ marginTop: '1rem' }} />

      {leftPopup && (
        <Modal onClose={() => setLeftPopup(false)}>
          <div style={{
            fontFamily: TITLE, fontWeight: 900, fontSize: '1.3rem',
            color: C.ink, letterSpacing: '-0.02em', marginBottom: '0.8rem'
          }}>
            {playerName} saiu?
          </div>
          <div style={{
            fontFamily: BODY, fontSize: '0.85rem', color: C.inkMuted,
            marginBottom: '1.8rem', lineHeight: 1.5
          }}>
            Esse jogador não será contabilizado nessa rodada e não poderá voltar até o início de uma nova partida.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <Btn onClick={() => { setLeftPopup(false); onPlayerLeft(); }}
              color={C.bg} bg={C.red} border={C.red}>
              Confirmar saída
            </Btn>
            <Btn onClick={() => setLeftPopup(false)} color={C.inkSoft} border={C.border}>
              Cancelar
            </Btn>
          </div>
        </Modal>
      )}
    </AppShell>
  );
}

// ============ TELA 5: VOTO SENHA ============
function PlayerVotePin({ playerName, playerIndex, totalPlayers, round, onConfirm, onBack, onHome, onPlayerLeft, onExample }) {
  const [pin, setPin] = useState('');
  const [leftPopup, setLeftPopup] = useState(false);

  return (
    <AppShell
      onBack={onBack}
      onHome={onHome}
      label={`RODADA ${round}`}
      onExample={onExample}
      cta={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <Btn onClick={() => onConfirm(pin)} disabled={pin.length !== 3} color={C.bg} bg={C.ink} border={C.ink}>
            OK
          </Btn>
          <button onClick={() => setLeftPopup(true)} style={{
            width: '100%', padding: '0.65rem', background: 'transparent',
            border: `1px solid ${C.border}`, borderRadius: `${R - 4}px`,
            color: C.inkMuted, fontFamily: BODY, fontWeight: 500,
            fontSize: '0.78rem', cursor: 'pointer', letterSpacing: '0.02em'
          }}>
            Jogador saiu do jogo
          </button>
        </div>
      }
    >
      <RoundBadge round={round} current={playerIndex} total={totalPlayers} />
      <div style={{ marginBottom: '2rem' }}>
        <div style={{
          fontFamily: TITLE, fontWeight: 900, fontSize: '2.2rem',
          color: C.ink, letterSpacing: '-0.03em',
          marginBottom: '0.4rem', wordBreak: 'break-word'
        }}>
          {playerName}
        </div>
        <div style={{ fontFamily: BODY, fontSize: '0.85rem', color: C.inkMuted }}>
          crie uma senha de 3 dígitos pra bloquear sua resposta
        </div>
      </div>
      <PinInput value={pin} onChange={setPin} />
      <Tagline style={{ marginTop: '1.5rem' }} />

      {leftPopup && (
        <Modal onClose={() => setLeftPopup(false)}>
          <div style={{
            fontFamily: TITLE, fontWeight: 900, fontSize: '1.3rem',
            color: C.ink, letterSpacing: '-0.02em', marginBottom: '0.8rem'
          }}>
            {playerName} saiu?
          </div>
          <div style={{
            fontFamily: BODY, fontSize: '0.85rem', color: C.inkMuted,
            marginBottom: '1.8rem', lineHeight: 1.5
          }}>
            Esse jogador não será contabilizado e não poderá voltar até o início de uma nova partida.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <Btn onClick={() => { setLeftPopup(false); onPlayerLeft(); }}
              color={C.bg} bg={C.red} border={C.red}>
              Confirmar saída
            </Btn>
            <Btn onClick={() => setLeftPopup(false)} color={C.inkSoft} border={C.border}>Cancelar</Btn>
          </div>
        </Modal>
      )}
    </AppShell>
  );
}

// ============ TELA 6: PLACAR ============
function Scoreboard({ question, round, players, votes, skipped, onNext, onHome, onExample }) {
  const activeVotes = votes.filter(v => !skipped.includes(v.playerIdx));
  const yesCount = activeVotes.filter(v => v.vote === 'yes').length;
  const noCount = activeVotes.filter(v => v.vote === 'no').length;
  const total = activeVotes.length;

  const minorityIsYes = yesCount <= noCount;
  const minorityLabel = minorityIsYes ? 'SIM' : 'NÃO';
  const minorityCount = minorityIsYes ? yesCount : noCount;
  const minorityColor = minorityIsYes ? C.green : C.red;
  const minorityGlow = minorityIsYes ? C.greenGlow : C.redGlow;

  // revealed: { playerIdx: 'yes'|'no' }, countdown: { playerIdx: seconds }
  const [revealed, setRevealed] = useState({});
  const [countdowns, setCountdowns] = useState({});
  const [hideTimers, setHideTimers] = useState({});
  const [tickIntervals, setTickIntervals] = useState({});
  const [unlockingIdx, setUnlockingIdx] = useState(null);
  const [pinAttempt, setPinAttempt] = useState('');
  const [pinError, setPinError] = useState(false);
  const [homeConfirm, setHomeConfirm] = useState(false);

  const REVEAL_SECS = 5;

  const revealPlayer = (playerIdx) => {
    setRevealed(prev => ({ ...prev, [playerIdx]: votes.find(v => v.playerIdx === playerIdx)?.vote }));
    setCountdowns(prev => ({ ...prev, [playerIdx]: REVEAL_SECS }));

    const interval = setInterval(() => {
      setCountdowns(prev => {
        const next = (prev[playerIdx] ?? 1) - 1;
        if (next <= 0) { clearInterval(interval); return { ...prev, [playerIdx]: 0 }; }
        return { ...prev, [playerIdx]: next };
      });
    }, 1000);

    const timer = setTimeout(() => {
      clearInterval(interval);
      setRevealed(prev => { const c = { ...prev }; delete c[playerIdx]; return c; });
      setCountdowns(prev => { const c = { ...prev }; delete c[playerIdx]; return c; });
    }, REVEAL_SECS * 1000);

    setTickIntervals(prev => { if (prev[playerIdx]) clearInterval(prev[playerIdx]); return { ...prev, [playerIdx]: interval }; });
    setHideTimers(prev => { if (prev[playerIdx]) clearTimeout(prev[playerIdx]); return { ...prev, [playerIdx]: timer }; });
  };

  const hidePlayer = (playerIdx) => {
    if (hideTimers[playerIdx]) clearTimeout(hideTimers[playerIdx]);
    if (tickIntervals[playerIdx]) clearInterval(tickIntervals[playerIdx]);
    setRevealed(prev => { const c = { ...prev }; delete c[playerIdx]; return c; });
    setCountdowns(prev => { const c = { ...prev }; delete c[playerIdx]; return c; });
  };

  const tryUnlock = () => {
    const vote = votes.find(v => v.playerIdx === unlockingIdx);
    if (vote && vote.pin === pinAttempt) {
      setUnlockingIdx(null);
      setPinAttempt('');
      setPinError(false);
      revealPlayer(unlockingIdx);
    } else {
      setPinError(true);
      const t = setTimeout(() => setPinError(false), 600);
      setPinAttempt('');
      return () => clearTimeout(t);
    }
  };

  const allSame = minorityCount === 0;

  return (
    <AppShell
      onHome={() => setHomeConfirm(true)}
      label={`RODADA ${round}`}
      onExample={onExample}
      cta={<Btn onClick={onNext} color={C.bg} bg={C.ink} border={C.ink}>Próxima pergunta</Btn>}
    >
      <div>

      {/* Pergunta */}
      <div style={{
        fontFamily: BODY, fontSize: '0.75rem', color: C.inkMuted,
        marginBottom: '0.8rem', lineHeight: 1.4
      }}>
        {question}
      </div>

      {/* Placar compacto */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.6rem' }}>
        {[
          { label: 'SIM', count: yesCount, color: C.green, glow: C.greenGlow },
          { label: 'NÃO', count: noCount, color: C.red, glow: C.redGlow }
        ].map((s, i) => (
          <div key={i} style={{
            background: C.card, border: `1.5px solid ${s.color}55`,
            borderRadius: `${R - 6}px`, padding: '0.7rem 0.5rem', textAlign: 'center'
          }}>
            <div style={{
              fontFamily: BODY, fontSize: '0.6rem', color: s.color,
              fontWeight: 700, letterSpacing: '0.12em', marginBottom: '0.15rem'
            }}>
              {s.label}
            </div>
            <div style={{
              fontFamily: TITLE, fontWeight: 900, fontSize: '2.2rem',
              color: C.ink, lineHeight: 1, letterSpacing: '-0.04em',
              textShadow: `0 0 14px ${s.glow}`
            }}>
              {s.count}
            </div>
            <div style={{ fontFamily: BODY, fontSize: '0.58rem', color: C.inkMuted, marginTop: '0.1rem' }}>
              de {total}
            </div>
          </div>
        ))}
      </div>

      {/* Action box ou consenso */}
      {minorityCount === 0 ? (
        <div style={{
          background: C.card, border: `2px solid ${C.green}`,
          borderRadius: `${R - 4}px`, padding: '0.9rem',
          textAlign: 'center', marginBottom: '0.8rem',
          boxShadow: `0 0 20px ${C.greenGlow}`,
          animation: 'pulseGlow 2.5s ease-in-out infinite'
        }}>
          <div style={{ fontSize: '1.4rem', marginBottom: '0.3rem' }}>🥃</div>
          <div style={{
            fontFamily: TITLE, fontWeight: 900, fontSize: '1.1rem',
            color: C.green, letterSpacing: '-0.02em', marginBottom: '0.2rem'
          }}>
            Todos votaram igual!
          </div>
          <div style={{ fontFamily: BODY, fontSize: '0.8rem', color: C.inkSoft }}>
            Que tal um shot pra comemorar?
          </div>
        </div>
      ) : (
        <>
          <div style={{
            background: C.card, border: `2px solid ${minorityColor}`,
            borderRadius: `${R - 4}px`, padding: '0.8rem 1rem',
            textAlign: 'center', marginBottom: '0.5rem',
            boxShadow: `0 0 20px ${minorityGlow}`,
            animation: 'pulseGlow 2.5s ease-in-out infinite'
          }}>
            <div style={{
              fontFamily: BODY, fontSize: '0.58rem', color: C.inkMuted,
              fontWeight: 700, letterSpacing: '0.2em', marginBottom: '0.3rem'
            }}>
              AÇÃO DA RODADA
            </div>
            <div style={{
              fontFamily: BODY, fontSize: '0.78rem', color: C.ink, marginBottom: '0.25rem'
            }}>
              votem em quem colocou{' '}
              <span style={{ color: minorityColor, fontWeight: 700 }}>{minorityLabel}</span>
              {' '}— {minorityCount === 1 ? 'foi só 1' : `foram só ${minorityCount}`}
            </div>
            <div style={{
              fontFamily: TITLE, fontWeight: 900, fontSize: '2.2rem',
              color: minorityColor, letterSpacing: '-0.02em', lineHeight: 1,
              textShadow: `0 0 16px ${minorityColor}`
            }}>
              {minorityLabel}
            </div>
          </div>

          {/* shots — 1 linha */}
          <div style={{
            background: '#0d0d0d', border: `1px solid ${C.border}`,
            borderRadius: '8px', padding: '0.45rem 0.7rem',
            marginBottom: '0.8rem',
            display: 'flex', alignItems: 'center', gap: '0.5rem'
          }}>
            <span style={{ fontSize: '0.85rem', flexShrink: 0 }}>🥃</span>
            <div style={{ fontFamily: BODY, fontSize: '0.7rem', color: C.inkSoft, lineHeight: 1.3 }}>
              {minorityCount === 1
                ? 'O jogador votado toma 1 shot da bebida que estiver bebendo.'
                : `Os ${minorityCount} votados tomam 1 shot da bebida que estiverem bebendo.`}
            </div>
          </div>
        </>
      )}

      {/* Desbloquear voto — só se não allSame */}
      {!allSame && (
        <>
          {/* label + linha */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <div style={{
              fontFamily: BODY, fontSize: '0.6rem', color: C.inkMuted,
              fontWeight: 700, letterSpacing: '0.12em', whiteSpace: 'nowrap'
            }}>
              DESBLOQUEAR VOTO
            </div>
            <div style={{ flex: 1, height: '1px', background: C.border }} />
          </div>

          {/* regra compacta — 2 linhas */}
          <div style={{
            fontFamily: BODY, fontSize: '0.65rem', color: C.inkMuted,
            lineHeight: 1.5, marginBottom: '0.6rem'
          }}>
            Votados podem expor o voto.{' '}
            <span style={{ color: C.red }}>Contrário → quem votou bebe 2 shots.</span>{' '}
            <span style={{ color: C.green }}>Igual → ninguém bebe.</span>
          </div>

          {/* Grid 4 colunas */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
            gap: '0.4rem', marginBottom: '0.5rem'
          }}>
            {players.map((name, i) => {
              const isSkipped = skipped.includes(i);
              const hasVote = votes.find(v => v.playerIdx === i);
              if (isSkipped || !hasVote) return null;

              const isRevealed = revealed[i] !== undefined;
              const rv = revealed[i];
              const rvColor = rv === 'yes' ? C.green : C.red;
              const secs = countdowns[i] ?? 0;

              return (
                <button key={i}
                  onClick={() => isRevealed ? hidePlayer(i) : setUnlockingIdx(i)}
                  style={{
                    background: isRevealed ? `${rvColor}12` : C.card,
                    border: `1.5px solid ${isRevealed ? rvColor + '99' : C.border}`,
                    borderRadius: '10px', padding: '0.55rem 0.3rem',
                    cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s'
                  }}
                >
                  <div style={{
                    fontFamily: TITLE, fontWeight: 700, color: C.ink,
                    fontSize: '0.72rem', wordBreak: 'break-word',
                    marginBottom: '0.2rem', lineHeight: 1.1
                  }}>
                    {name}
                  </div>
                  {isRevealed ? (
                    <>
                      <div style={{
                        fontFamily: TITLE, fontWeight: 900, fontSize: '0.85rem',
                        color: rvColor, letterSpacing: '-0.01em'
                      }}>
                        {rv === 'yes' ? 'SIM' : 'NÃO'}
                      </div>
                      <div style={{ marginTop: '0.25rem' }}>
                        <div style={{
                          width: '100%', height: '2px', background: C.border,
                          borderRadius: '2px', overflow: 'hidden', marginBottom: '0.15rem'
                        }}>
                          <div style={{
                            width: `${(secs / 5) * 100}%`, height: '100%',
                            background: rvColor, borderRadius: '2px',
                            transition: 'width 0.9s linear'
                          }} />
                        </div>
                        <div style={{ fontFamily: BODY, fontSize: '0.5rem', color: C.inkMuted }}>
                          {secs}s
                        </div>
                      </div>
                    </>
                  ) : (
                    <div style={{ fontSize: '0.75rem' }}>🔒</div>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}

      </div>

      {/* Modal desbloqueio */}
      {unlockingIdx !== null && (
        <Modal onClose={() => { setUnlockingIdx(null); setPinAttempt(''); }}>
          <div style={{
            fontFamily: BODY, fontSize: '0.65rem', color: C.inkMuted,
            fontWeight: 700, letterSpacing: '0.15em', textAlign: 'center', marginBottom: '0.4rem'
          }}>
            SENHA DE
          </div>
          <div style={{
            fontFamily: TITLE, fontWeight: 900, fontSize: '1.7rem',
            color: C.ink, letterSpacing: '-0.03em',
            textAlign: 'center', marginBottom: '1.8rem', wordBreak: 'break-word'
          }}>
            {players[unlockingIdx]}
          </div>

          <div style={{ transform: pinError ? 'translateX(-4px)' : 'none', transition: 'transform 0.1s' }}>
            <PinInput value={pinAttempt} onChange={setPinAttempt} />
          </div>

          {pinError && (
            <div style={{
              textAlign: 'center', fontFamily: BODY, fontWeight: 600,
              color: C.red, fontSize: '0.78rem', marginTop: '0.8rem'
            }}>
              Senha incorreta
            </div>
          )}

          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <Btn onClick={tryUnlock} disabled={pinAttempt.length !== 3} color={C.bg} bg={C.ink} border={C.ink}>
              Revelar
            </Btn>
            <Btn onClick={() => { setUnlockingIdx(null); setPinAttempt(''); }} color={C.inkSoft} border={C.border}>
              Cancelar
            </Btn>
          </div>
        </Modal>
      )}

      {/* Modal confirmação home */}
      {homeConfirm && (
        <Modal onClose={() => setHomeConfirm(false)}>
          <div style={{
            fontFamily: TITLE, fontWeight: 900, fontSize: '1.4rem',
            color: C.ink, letterSpacing: '-0.02em', marginBottom: '0.7rem'
          }}>
            Voltar ao início?
          </div>
          <div style={{
            fontFamily: BODY, fontSize: '0.85rem', color: C.inkMuted,
            marginBottom: '1.8rem', lineHeight: 1.5
          }}>
            O jogo atual será encerrado e vocês voltarão para a tela inicial.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <Btn onClick={onHome} color={C.bg} bg={C.ink} border={C.ink}>Confirmar</Btn>
            <Btn onClick={() => setHomeConfirm(false)} color={C.inkSoft} border={C.border}>Cancelar</Btn>
          </div>
        </Modal>
      )}
    </AppShell>
  );
}

// ============ TELA: BARALHO ESGOTADO ============
function DeckEmpty({ deck, onBuy, onHome }) {
  const { hasExtension, user, signInWithGoogle, redeemCoupon: redeemCouponFirebase } = useAuth();
  const isPremium = hasExtension(deck.id);
  const [showBuySheet, setShowBuySheet] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState(false);
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingCoupon, setLoadingCoupon] = useState(false);
  const [loadingBuy, setLoadingBuy] = useState(false);

  const handleLogin = async () => {
    setLoadingLogin(true);
    try { await signInWithGoogle(); } catch (e) { } finally { setLoadingLogin(false); }
  };

  const handleBuy = async () => {
    if (!user) { await handleLogin(); return; }
    setLoadingBuy(true);
    try {
      const res = await fetch('/api/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: user.uid, deckId: deck.id }),
      });
      const data = await res.json();
      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        console.error('[handleBuy] sem init_point:', data);
      }
    } catch (e) {
      console.error('[handleBuy] erro:', e);
    } finally {
      setLoadingBuy(false);
    }
  };

  const handleCoupon = async () => {
    if (!user) { setCouponError('Faça login primeiro para usar o cupom.'); return; }
    setLoadingCoupon(true);
    try {
      await redeemCouponFirebase(couponInput.trim(), deck.id);
      setCouponSuccess(true);
      setCouponError('');
      setTimeout(() => { setShowBuySheet(false); onBuy(); }, 1200);
    } catch (e) {
      setCouponError(e.message);
    } finally {
      setLoadingCoupon(false);
    }
  };

  const premiumCount = deck.totalCount - deck.freeCount;

  return (
    <AppShell
      onHome={onHome}
      cta={
        <Btn onClick={onHome} color={C.inkSoft} border={C.border}>
          Voltar ao início
        </Btn>
      }
    >
      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', paddingTop: '1.5rem'
      }}>
        {/* ícone */}
        <div style={{
          width: '60px', height: '60px', borderRadius: '16px',
          background: C.card, border: `1.5px solid ${C.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.8rem', marginBottom: '1.2rem'
        }}>
          🃏
        </div>

        {isPremium ? (
          <>
            <div style={{
              fontFamily: TITLE, fontWeight: 900, fontSize: '1.5rem',
              color: C.ink, letterSpacing: '-0.03em', lineHeight: 1.1,
              marginBottom: '0.7rem'
            }}>
              As cartas acabaram!
            </div>
            <div style={{
              fontFamily: BODY, fontSize: '0.82rem', color: C.inkMuted,
              lineHeight: 1.55, marginBottom: '1.5rem', maxWidth: '280px'
            }}>
              Vocês jogaram todas as {deck.totalCount} cartas do baralho. Que tal jogar de novo?
            </div>
            <div style={{
              background: C.card, border: `1px solid ${C.border}`,
              borderRadius: `${R - 4}px`, padding: '0.9rem 1rem',
              width: '100%', textAlign: 'center', marginBottom: '0.5rem'
            }}>
              <div style={{ fontFamily: BODY, fontSize: '0.72rem', color: C.inkMuted, lineHeight: 1.5 }}>
                🔜 Em breve novas expansões do baralho
              </div>
            </div>
          </>
        ) : (
          <>
            <div style={{
              fontFamily: TITLE, fontWeight: 900, fontSize: '1.5rem',
              color: C.ink, letterSpacing: '-0.03em', lineHeight: 1.1,
              marginBottom: '0.7rem'
            }}>
              Acabaram as cartas grátis!
            </div>
            <div style={{
              fontFamily: BODY, fontSize: '0.82rem', color: C.inkMuted,
              lineHeight: 1.55, marginBottom: '1.8rem', maxWidth: '280px'
            }}>
              Vocês jogaram todas as {deck.freeCount} cartas gratuitas. Desbloqueie as {premiumCount} cartas restantes para continuar.
            </div>
            <div style={{
              width: '100%', background: '#111', border: `2px solid ${C.green}`,
              borderRadius: `${R - 4}px`, padding: '1rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                <div>
                  <div style={{ fontFamily: TITLE, fontWeight: 900, fontSize: '1rem', color: C.ink, letterSpacing: '-0.02em' }}>
                    {deck.name}
                  </div>
                  <div style={{ fontFamily: BODY, fontSize: '0.65rem', color: C.inkMuted, marginTop: '0.15rem' }}>
                    {premiumCount} cartas premium restantes
                  </div>
                </div>
                <div style={{
                  background: `${C.green}22`, border: `1px solid ${C.green}55`,
                  borderRadius: '100px', padding: '0.2rem 0.6rem',
                  fontFamily: BODY, fontSize: '0.58rem', color: C.green, fontWeight: 700
                }}>
                  +18
                </div>
              </div>
              <button onClick={() => setShowBuySheet(true)} style={{
                width: '100%', background: C.green, border: 'none',
                borderRadius: '9px', padding: '0.75rem 1rem',
                cursor: 'pointer', textAlign: 'center'
              }}>
                <div style={{ fontFamily: TITLE, fontWeight: 900, fontSize: '0.95rem', color: '#000', letterSpacing: '-0.01em' }}>
                  Baralho completo
                </div>
                <div style={{ fontFamily: BODY, fontSize: '0.65rem', color: '#1a3d00', marginTop: '0.1rem', fontWeight: 500 }}>
                  {deck.totalCount} cartas por {deck.price}
                </div>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Bottom sheet de compra */}
      {showBuySheet && (
        <div
          onClick={() => { setShowBuySheet(false); setCouponError(''); setCouponInput(''); }}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
            zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center'
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#0c0c0c', borderRadius: `${R}px ${R}px 0 0`,
              border: `1.5px solid ${C.border}`, borderBottom: 'none',
              padding: '1.5rem', width: '100%', maxWidth: '480px'
            }}
          >
            <div style={{ width: '2rem', height: '3px', background: '#333', borderRadius: '2px', margin: '0 auto 1.2rem' }} />

            <div style={{ textAlign: 'center', marginBottom: '1.2rem' }}>
              <div style={{ fontFamily: TITLE, fontWeight: 900, fontSize: '1.3rem', color: C.ink, letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
                {deck.name}
              </div>
              <div style={{ fontFamily: BODY, fontSize: '0.75rem', color: C.inkMuted }}>
                baralho completo · {deck.totalCount} cartas
              </div>
            </div>

            <div style={{ background: '#111', border: `1px solid ${C.border}`, borderRadius: `${R - 6}px`, padding: '0.9rem 1rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div style={{ fontFamily: BODY, fontSize: '0.78rem', color: C.inkSoft }}>{deck.freeCount} cartas grátis</div>
                <div style={{ fontFamily: BODY, fontSize: '0.78rem', color: C.green, fontWeight: 700 }}>incluso</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                <div style={{ fontFamily: BODY, fontSize: '0.78rem', color: C.inkSoft }}>{premiumCount} cartas premium</div>
                <div style={{ fontFamily: BODY, fontSize: '0.78rem', color: C.ink, fontWeight: 700 }}>desbloqueadas</div>
              </div>
              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: '0.7rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontFamily: BODY, fontSize: '0.85rem', color: C.ink, fontWeight: 700 }}>Total</div>
                <div style={{ fontFamily: TITLE, fontWeight: 900, fontSize: '1.3rem', color: C.green, letterSpacing: '-0.02em' }}>{deck.price}</div>
              </div>
            </div>

            <button
              onClick={handleBuy}
              disabled={loadingBuy}
              style={{
                width: '100%', background: C.green, border: 'none',
                borderRadius: `${R - 6}px`, padding: '0.95rem',
                cursor: loadingBuy ? 'not-allowed' : 'pointer', marginBottom: '0.8rem',
                opacity: loadingBuy ? 0.7 : 1
              }}
            >
              <div style={{ fontFamily: TITLE, fontWeight: 900, fontSize: '1rem', color: '#000' }}>{loadingBuy ? 'Aguarde...' : `Comprar agora · ${deck.price}`}</div>
              <div style={{ fontFamily: BODY, fontSize: '0.68rem', color: '#1a3d00', marginTop: '0.1rem' }}>pix · cartão · pagamento seguro</div>
            </button>

            {!user && (
              <button onClick={handleLogin} disabled={loadingLogin} style={{
                width: '100%', background: '#fff', border: 'none',
                borderRadius: `${R - 6}px`, padding: '0.85rem',
                cursor: loadingLogin ? 'not-allowed' : 'pointer',
                marginBottom: '0.7rem', display: 'flex',
                alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
                opacity: loadingLogin ? 0.7 : 1
              }}>
                <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16 19 12 24 12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.1l-6.2-5.2C29.3 35.5 26.8 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.4 4.3-4.4 5.7l6.2 5.2C36.9 40.1 44 35 44 24c0-1.3-.1-2.6-.4-3.9z"/></svg>
                <span style={{ fontFamily: BODY, fontWeight: 700, fontSize: '0.9rem', color: '#222' }}>
                  {loadingLogin ? 'Entrando...' : 'Entrar com Google'}
                </span>
              </button>
            )}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input
                value={couponInput}
                onChange={e => { setCouponInput(e.target.value); setCouponError(''); }}
                placeholder="Tem um cupom?"
                style={{
                  flex: 1, background: '#111', border: `1px solid ${C.border}`,
                  borderRadius: '10px', padding: '0.65rem 0.9rem',
                  color: C.ink, fontFamily: BODY, fontSize: '16px', outline: 'none'
                }}
              />
              <button onClick={handleCoupon} disabled={loadingCoupon} style={{
                background: 'transparent', border: `1px solid ${C.border}`,
                borderRadius: '10px', padding: '0.65rem 1rem',
                color: C.ink, fontFamily: BODY, fontSize: '0.8rem',
                fontWeight: 600, cursor: loadingCoupon ? 'not-allowed' : 'pointer',
                whiteSpace: 'nowrap', opacity: loadingCoupon ? 0.6 : 1
              }}>
                {loadingCoupon ? '...' : 'Aplicar'}
              </button>
            </div>
            {couponError && <div style={{ fontFamily: BODY, fontSize: '0.7rem', color: C.red, marginBottom: '0.4rem' }}>{couponError}</div>}
            {couponSuccess && <div style={{ fontFamily: BODY, fontSize: '0.7rem', color: C.green, marginBottom: '0.4rem', fontWeight: 600 }}>Cupom aplicado! Baralho desbloqueado.</div>}

            <div style={{ textAlign: 'center', fontFamily: BODY, fontSize: '0.65rem', color: C.inkMuted }}>
              compra única · disponível em todos seus dispositivos
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}


// ============ ONBOARDING ============
const ONBOARDING_STEPS = [
  {
    emoji: '⚠️',
    title: 'Cuidado!',
    text: 'Você está prestes a jogar um jogo onde talvez vá expor os seus maiores segredos.',
    accent: '#ff3d5a'
  },
  {
    emoji: '🚫',
    title: 'Regra nº 1',
    text: 'Nesse jogo você não pode mentir. Aqui vale a honestidade — ou os shots.',
    accent: '#ff3d5a'
  },
  {
    emoji: '🥃',
    title: 'Preparem os shots',
    text: 'Cadastre todos os jogadores e deixe as bebidas prontas. A partir de agora, vocês vão beber de verdade.',
    accent: '#9fff3d'
  },
  {
    emoji: '🃏',
    title: 'Responda na sua vez',
    text: 'Uma pergunta aparece na tela. Cada jogador responde SIM ou NÃO com sinceridade, um de cada vez.',
    accent: '#ffffff'
  },
  {
    emoji: '🔒',
    title: 'Crie sua senha',
    text: 'Respondeu? Crie uma senha de 3 dígitos para bloquear seu voto. Não conta pra ninguém! Passe o celular pro próximo.',
    accent: '#4d5fff'
  },
  {
    emoji: '📊',
    title: 'O placar aparece',
    text: 'Quando todos votaram, o app mostra quantos disseram SIM e quantos disseram NÃO — sem revelar quem.',
    accent: '#ffffff'
  },
  {
    emoji: '👆',
    title: 'Votem na minoria',
    text: 'Hora do debate! Olhem uns para os outros, discutam, e decidam juntos quem votou na minoria. O app só mostra o resultado — a votação é de vocês.',
    accent: '#9fff3d'
  },
  {
    emoji: '💥',
    title: 'Os votados bebem',
    text: 'Os mais apontados pelo grupo bebem 1 shot cada — a menos que queiram se expor e revelar o voto.',
    accent: '#ff3d5a'
  },
  {
    emoji: '🎯',
    title: 'Exemplo de rodada',
    text: 'Veja como funciona na prática →',
    accent: '#9fff3d',
    isExample: true
  }
];

function Onboarding({ onDone }) {
  const [step, setStep] = useState(0);
  const current = ONBOARDING_STEPS[step];
  const isLast = step === ONBOARDING_STEPS.length - 1;
  const total = ONBOARDING_STEPS.length;

  return (
    <div style={{
      position: 'fixed', inset: 0, background: C.bg,
      display: 'flex', flexDirection: 'column',
      maxWidth: '480px', margin: '0 auto'
    }}>
      {/* Header */}
      <div style={{
        flexShrink: 0, display: 'flex',
        alignItems: 'center', justifyContent: 'space-between',
        padding: '3rem 1.4rem 1rem'
      }}>
        <div style={{ width: '60px' }}>
          {step > 0 && (
            <button onClick={() => setStep(step - 1)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: C.inkSoft, fontFamily: BODY, fontSize: '0.85rem',
              fontWeight: 500, padding: 0, display: 'flex', alignItems: 'center', gap: '0.3rem'
            }}>
              <span style={{ fontSize: '1.1rem' }}>←</span> Voltar
            </button>
          )}
        </div>

        {/* dots */}
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} style={{
              width: i === step ? '14px' : '5px',
              height: '5px', borderRadius: '3px',
              background: i === step ? C.ink : C.border,
              transition: 'all 0.3s'
            }} />
          ))}
        </div>

        <button onClick={onDone} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: C.inkMuted, fontFamily: BODY, fontSize: '0.65rem',
          fontWeight: 700, letterSpacing: '0.12em', padding: 0, width: '60px', textAlign: 'right'
        }}>
          PULAR
        </button>
      </div>

      {/* Conteúdo */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 2rem', textAlign: 'center'
      }}>
        <div style={{
          fontSize: '4.5rem', marginBottom: '1.5rem', lineHeight: 1
        }}>
          {current.emoji}
        </div>

        <div style={{
          fontFamily: TITLE, fontWeight: 900,
          fontSize: '1.8rem', color: C.ink,
          letterSpacing: '-0.03em', lineHeight: 1.05,
          marginBottom: '1rem'
        }}>
          {current.title}
        </div>

        <div style={{
          fontFamily: BODY, fontSize: '0.95rem',
          color: C.inkSoft, lineHeight: 1.6,
          maxWidth: '300px'
        }}>
          {current.text}
        </div>
      </div>

      {/* CTA */}
      <div style={{ flexShrink: 0, padding: '0.8rem 1.4rem 1.8rem' }}>
        {isLast ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
            <ExamplePreview />
            <Btn onClick={onDone} color={C.bg} bg={C.ink} border={C.ink}>
              Bora jogar!
            </Btn>
          </div>
        ) : (
          <Btn onClick={() => setStep(step + 1)} color={C.bg} bg={C.ink} border={C.ink}>
            Continuar
          </Btn>
        )}
      </div>
    </div>
  );
}

// Preview compacto do exemplo na última tela do onboarding
function ExamplePreview() {
  return (
    <div style={{
      background: C.card, border: `1.5px solid ${C.border}`,
      borderRadius: `${R - 4}px`, padding: '0.9rem 1rem'
    }}>
      <div style={{
        fontFamily: BODY, fontSize: '0.62rem', color: C.inkMuted,
        fontWeight: 700, letterSpacing: '0.15em', marginBottom: '0.6rem'
      }}>
        EXEMPLO RÁPIDO
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {[
          { name: 'Victor', result: 'revelou NÃO (grupo achava SIM)', color: C.red, drink: 'quem votou nele bebe 2 🥃🥃' },
          { name: 'Maria', result: 'revelou SIM (grupo acertou)', color: C.green, drink: 'ela não bebe ✓' },
          { name: 'João', result: 'não se expôs', color: C.inkMuted, drink: 'bebe 1 shot 🥃' },
        ].map((p, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '0.35rem 0.5rem',
            background: '#0a0a0a', borderRadius: '6px'
          }}>
            <div>
              <div style={{ fontFamily: TITLE, fontWeight: 700, fontSize: '0.78rem', color: C.ink }}>{p.name}</div>
              <div style={{ fontFamily: BODY, fontSize: '0.6rem', color: p.color }}>{p.result}</div>
            </div>
            <div style={{ fontFamily: BODY, fontSize: '0.6rem', color: C.inkMuted, textAlign: 'right', maxWidth: '100px' }}>{p.drink}</div>
          </div>
        ))}
        <div style={{
          fontFamily: BODY, fontSize: '0.62rem', color: C.inkMuted,
          padding: '0.3rem 0.5rem', borderTop: `1px solid ${C.border}`, marginTop: '0.2rem'
        }}>
          💡 Empate na votação? Refazem. Se persistir, todos bebem 1 e passa a rodada.
        </div>
      </div>
    </div>
  );
}

// ============ TELA DE EXEMPLO (acessível durante o jogo) ============
function ExampleScreen({ onClose }) {
  return (
    <AppShell
      onBack={onClose}
      label="COMO FUNCIONA"
    >
      <div style={{ paddingTop: '0.5rem' }}>
        <div style={{
          fontFamily: TITLE, fontWeight: 900, fontSize: '1.5rem',
          color: C.ink, letterSpacing: '-0.03em', marginBottom: '0.3rem'
        }}>
          Exemplo de rodada
        </div>
        <div style={{
          fontFamily: BODY, fontSize: '0.82rem', color: C.inkMuted,
          marginBottom: '1.2rem', lineHeight: 1.4,
          fontStyle: 'italic'
        }}>
          "Já deu um beijo triplo?"
        </div>

        {/* Placar */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.8rem' }}>
          {[{ l: 'SIM', n: 3, c: C.green }, { l: 'NÃO', n: 4, c: C.red }].map((s, i) => (
            <div key={i} style={{
              background: C.card, border: `1.5px solid ${s.c}55`,
              borderRadius: `${R - 6}px`, padding: '0.6rem', textAlign: 'center'
            }}>
              <div style={{ fontFamily: BODY, fontSize: '0.6rem', color: s.c, fontWeight: 700, letterSpacing: '0.12em' }}>{s.l}</div>
              <div style={{ fontFamily: TITLE, fontWeight: 900, fontSize: '2rem', color: C.ink, lineHeight: 1 }}>{s.n}</div>
            </div>
          ))}
        </div>

        {/* Action */}
        <div style={{
          background: C.card, border: `2px solid ${C.green}`,
          borderRadius: `${R - 4}px`, padding: '0.7rem 1rem',
          textAlign: 'center', marginBottom: '1rem'
        }}>
          <div style={{ fontFamily: BODY, fontSize: '0.6rem', color: C.inkMuted, fontWeight: 700, letterSpacing: '0.15em', marginBottom: '0.3rem' }}>AÇÃO DA RODADA</div>
          <div style={{ fontFamily: BODY, fontSize: '0.8rem', color: C.ink, marginBottom: '0.2rem' }}>
            O grupo debate e vota em quem colocou <span style={{ color: C.green, fontWeight: 700 }}>SIM</span>
          </div>
          <div style={{ fontFamily: BODY, fontSize: '0.72rem', color: C.inkMuted }}>
            Olhem uns pros outros, discutam e decidam juntos — a votação é de vocês
          </div>
        </div>

        {/* Casos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '0.8rem' }}>
          {[
            {
              name: 'Victor', badge: 'revelou: NÃO', badgeColor: C.red,
              desc: 'O grupo achava que ele votou SIM. Ele se expôs e mostrou NÃO.',
              result: '→ quem votou nele bebe 2 shots 🥃🥃', resultColor: C.red,
              bg: `${C.red}12`, border: `${C.red}44`
            },
            {
              name: 'Maria', badge: 'revelou: SIM', badgeColor: C.green,
              desc: 'O grupo votou SIM nela e era isso mesmo. Ela confirmou.',
              result: '→ Maria não bebe nada ✓', resultColor: C.green,
              bg: `${C.green}12`, border: `${C.green}44`
            },
            {
              name: 'João', badge: '🔒 não se expôs', badgeColor: C.inkMuted,
              desc: 'João preferiu não revelar. Sem julgamentos.',
              result: '→ João bebe 1 shot 🥃', resultColor: C.inkSoft,
              bg: C.card, border: C.border
            }
          ].map((p, i) => (
            <div key={i} style={{
              background: p.bg, border: `1px solid ${p.border}`,
              borderRadius: `${R - 6}px`, padding: '0.75rem 0.9rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                <div style={{ fontFamily: TITLE, fontWeight: 900, fontSize: '0.9rem', color: C.ink }}>{p.name}</div>
                <div style={{
                  background: `${p.badgeColor}22`, borderRadius: '100px',
                  padding: '0.15rem 0.6rem',
                  fontFamily: BODY, fontSize: '0.58rem', color: p.badgeColor, fontWeight: 700
                }}>{p.badge}</div>
              </div>
              <div style={{ fontFamily: BODY, fontSize: '0.72rem', color: C.inkMuted, lineHeight: 1.4, marginBottom: '0.3rem' }}>{p.desc}</div>
              <div style={{ fontFamily: BODY, fontSize: '0.72rem', color: p.resultColor, fontWeight: 700 }}>{p.result}</div>
            </div>
          ))}
        </div>

        {/* Empate */}
        <div style={{
          background: '#0a0a0a', border: `1px solid ${C.border}`,
          borderRadius: `${R - 8}px`, padding: '0.7rem 0.9rem', marginBottom: '0.5rem'
        }}>
          <div style={{ fontFamily: BODY, fontSize: '0.6rem', color: C.inkMuted, fontWeight: 700, letterSpacing: '0.12em', marginBottom: '0.3rem' }}>
            SE DER EMPATE NA VOTAÇÃO
          </div>
          <div style={{ fontFamily: BODY, fontSize: '0.72rem', color: C.inkMuted, lineHeight: 1.5 }}>
            Refazem a votação. Se continuar empatado, todos bebem 1 shot e passa pra próxima rodada.
          </div>
        </div>
      </div>
    </AppShell>
  );
}

// ============ AGE GATE ============
function AgeGate({ onConfirm, onDeny }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: C.bg,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '2rem 1.4rem', maxWidth: '480px', margin: '0 auto',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '3.5rem', marginBottom: '1.2rem', lineHeight: 1 }}>🔞</div>

      <div style={{
        fontFamily: TITLE, fontWeight: 900,
        fontSize: 'clamp(1.6rem, 6vw, 2rem)',
        color: C.ink, letterSpacing: '-0.03em',
        lineHeight: 1.05, marginBottom: '0.8rem'
      }}>
        Conteúdo +18
      </div>

      <div style={{
        fontFamily: BODY, fontSize: '0.9rem',
        color: C.inkMuted, lineHeight: 1.6,
        maxWidth: '300px', marginBottom: '2.5rem'
      }}>
        Este app contém perguntas de conteúdo adulto. Você confirma que tem 18 anos ou mais?
      </div>

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
        <Btn onClick={onConfirm} color={C.bg} bg={C.ink} border={C.ink}>
          Sim, tenho 18 anos ou mais
        </Btn>
        <Btn onClick={onDeny} color={C.inkMuted} border={C.border}>
          Não, sou menor de idade
        </Btn>
      </div>

      <div style={{
        marginTop: '1.5rem', fontFamily: BODY,
        fontSize: '0.62rem', color: C.inkMuted, lineHeight: 1.5,
        maxWidth: '280px'
      }}>
        Ao continuar, você declara ter idade legal para acessar conteúdo adulto conforme a legislação do seu país.
      </div>
    </div>
  );
}

// ============ TELA DE ACESSO NEGADO ============
function AccessDenied() {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: C.bg,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '2rem 1.4rem', maxWidth: '480px', margin: '0 auto',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚫</div>
      <div style={{
        fontFamily: TITLE, fontWeight: 900, fontSize: '1.5rem',
        color: C.ink, letterSpacing: '-0.03em', marginBottom: '0.7rem'
      }}>
        Acesso restrito
      </div>
      <div style={{
        fontFamily: BODY, fontSize: '0.88rem',
        color: C.inkMuted, lineHeight: 1.6, maxWidth: '280px'
      }}>
        Este app é exclusivo para maiores de 18 anos.
      </div>
    </div>
  );
}

// ============ APP PRINCIPAL ============
export default function App() {
  const { extensions, hasExtension, syncExtensions, user } = useAuth();

  // Detecta retorno da página de pagamento do Mercado Pago
  const [paymentBanner, setPaymentBanner] = useState(null); // 'verifying' | 'success' | 'failed'

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ps = params.get('payment');
    if (!ps) return;
    window.history.replaceState({}, '', '/');
    if (ps === 'success') setPaymentBanner('verifying');
    if (ps === 'failure') {
      setPaymentBanner('failed');
      setTimeout(() => setPaymentBanner(null), 4000);
    }
  }, []);

  useEffect(() => {
    if (paymentBanner !== 'verifying') return;
    if (!user?.uid) return;
    syncExtensions(user.uid).then(() => {}).catch(() => {});
  }, [paymentBanner, user]);

  useEffect(() => {
    if (paymentBanner === 'verifying' && Object.keys(extensions).length > 0) {
      setPaymentBanner('success');
      setTimeout(() => setPaymentBanner(null), 3500);
    }
  }, [extensions, paymentBanner]);

  // Age gate — verifica localStorage
  const [ageConfirmed, setAgeConfirmed] = useState(() => {
    return localStorage.getItem('age_confirmed') === 'true';
  });
  const [ageDenied, setAgeDenied] = useState(false);

  const handleAgeConfirm = () => {
    localStorage.setItem('age_confirmed', 'true');
    setAgeConfirmed(true);
  };

  const handleAgeDeny = () => {
    setAgeDenied(true);
  };

  const [stage, setStage] = useState(() => {
    return localStorage.getItem('onboarding_done') === 'true' ? 'deckSelect' : 'onboarding';
  });
  const [prevStage, setPrevStage] = useState(null);
  const [playerCount, setPlayerCount] = useState(4);
  const [selectedDeck, setSelectedDeck] = useState(DECK_PROIBIDAO);
  const [selectedDeckIds, setSelectedDeckIds] = useState(['proibidao']);

  const goExample = () => { setPrevStage(stage); setStage('example'); };
  const closeExample = () => setStage(prevStage || 'deckSelect');
  const [players, setPlayers] = useState([]);
  const [round, setRound] = useState(1);
  const [deck, setDeck] = useState([]);
  const [currentCard, setCurrentCard] = useState('');
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);
  const [votes, setVotes] = useState([]);
  const [pendingVote, setPendingVote] = useState(null);
  const [skippedPlayers, setSkippedPlayers] = useState([]); // playerIdx que saíram

  // fonte + css global
  useEffect(() => {
    const preconnect1 = document.createElement('link');
    preconnect1.rel = 'preconnect';
    preconnect1.href = 'https://fonts.googleapis.com';
    document.head.appendChild(preconnect1);
    const preconnect2 = document.createElement('link');
    preconnect2.rel = 'preconnect';
    preconnect2.href = 'https://fonts.gstatic.com';
    preconnect2.crossOrigin = 'anonymous';
    document.head.appendChild(preconnect2);
    const link = document.createElement('link');
    link.href = FONT_URL; link.rel = 'stylesheet';
    document.head.appendChild(link);
    const style = document.createElement('style');
    style.textContent = `
      * { box-sizing: border-box; }
      body { margin: 0; background: #000; }
      input::placeholder { color: #2a2a2a; }
      @keyframes pulseGlow {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.75; }
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(link); document.head.removeChild(style); };
  }, []);

  const drawCard = (d) => {
    if (d.length === 0) {
      // baralho esgotado
      setStage('deckEmpty');
      return;
    }
    setCurrentCard(d[0]);
    setDeck(d.slice(1));
  };

  const startGame = (names, deckIds) => {
    setPlayers(names);
    const allCards = [];
    deckIds.forEach(deckId => {
      const d = ALL_DECKS.find(x => x.id === deckId);
      if (!d) return;
      const hasExt = hasExtension(deckId);
      const cards = hasExt ? d.cards : d.cards.slice(0, d.freeCount);
      cards.forEach(text => allCards.push({ text, deckId, deckEmoji: d.emoji, deckAccent: d.accentColor }));
    });
    const shuffled = shuffle(allCards);
    setCurrentCard(shuffled[0]); setDeck(shuffled.slice(1));
    setRound(1); setVotes([]); setCurrentPlayerIdx(0);
    setSkippedPlayers([]);
    setStage('card');
  };

  const goHome = () => {
    setStage('deckSelect');
    setVotes([]);
    setSkippedPlayers([]);
    setPendingVote(null);
    setCurrentPlayerIdx(0);
    setRound(1);
    setCurrentCard('');
    setDeck([]);
  };

  // Acha próximo player ativo (não skipped)
  const nextActivePlayer = (fromIdx, currentSkipped) => {
    for (let i = fromIdx + 1; i < players.length; i++) {
      if (!currentSkipped.includes(i)) return i;
    }
    return -1; // todos votaram
  };

  const handleChoose = (vote) => {
    setPendingVote(vote);
    setStage('votePin');
  };

  const handlePinConfirm = (pin) => {
    const newVotes = [...votes, { playerIdx: currentPlayerIdx, vote: pendingVote, pin }];
    setVotes(newVotes);
    setPendingVote(null);
    const next = nextActivePlayer(currentPlayerIdx, skippedPlayers);
    if (next === -1) {
      setStage('score');
    } else {
      setCurrentPlayerIdx(next);
      setStage('voteChoice');
    }
  };

  const handlePlayerLeft = () => {
    const newSkipped = [...skippedPlayers, currentPlayerIdx];
    setSkippedPlayers(newSkipped);
    const next = nextActivePlayer(currentPlayerIdx, newSkipped);
    if (next === -1) {
      setStage('score');
    } else {
      setCurrentPlayerIdx(next);
      setStage('voteChoice');
    }
  };

  const nextRound = () => {
    const activePlayers = players.filter((_, i) => !skippedPlayers.includes(i));
    if (activePlayers.length < 3) {
      setStage('gameOver');
      return;
    }
    setRound(round + 1);
    setVotes([]);
    setPendingVote(null);
    const first = players.findIndex((_, i) => !skippedPlayers.includes(i));
    setCurrentPlayerIdx(first === -1 ? 0 : first);
    drawCard(deck);
    setStage('card');
  };

  // Contagem de players ativos para exibir na barra
  const activeTotalForRound = players.filter((_, i) => !skippedPlayers.includes(i)).length;
  const activeOrderIdx = players
    .slice(0, currentPlayerIdx + 1)
    .filter((_, i) => !skippedPlayers.includes(i)).length - 1;

  const screen = (() => {
    if (ageDenied) return <AccessDenied />;
    if (!ageConfirmed) return <AgeGate onConfirm={handleAgeConfirm} onDeny={handleAgeDeny} />;
    if (stage === 'onboarding') return <Onboarding onDone={() => {
      localStorage.setItem('onboarding_done', 'true');
      setStage('deckSelect');
    }} />;
    if (stage === 'example') return <ExampleScreen onClose={closeExample} />;
    if (stage === 'deckSelect') return (
      <DeckSelect
        onNext={(deckIds) => { setSelectedDeckIds(deckIds); setStage('setupCount'); }}
        onTutorial={() => { setPrevStage('deckSelect'); setStage('onboarding'); }}
      />
    );
    if (stage === 'setupCount') return (
      <SetupCount
        onNext={(c) => { setPlayerCount(c); setStage('setupNames'); }}
        onBack={() => setStage('deckSelect')}
        onTutorial={() => { setPrevStage('setupCount'); setStage('onboarding'); }}
      />
    );
    if (stage === 'setupNames') return (
      <SetupNames
        initialCount={playerCount}
        onNext={(names) => startGame(names, selectedDeckIds)}
        onBack={() => setStage('setupCount')}
      />
    );
    if (stage === 'card') return (
      <CardReveal
        question={typeof currentCard === 'object' ? currentCard.text : currentCard}
        deckEmoji={typeof currentCard === 'object' ? currentCard.deckEmoji : null}
        deckAccent={typeof currentCard === 'object' ? currentCard.deckAccent : null}
        totalDecks={selectedDeckIds.length}
        round={round}
        onHome={goHome}
        onStart={() => setStage('voteChoice')}
        onSkip={() => { if (deck.length === 0) { setStage('deckEmpty'); } else { drawCard(deck); } }}
        onExample={goExample}
      />
    );
    if (stage === 'voteChoice') return (
      <PlayerVoteChoice
        question={typeof currentCard === 'object' ? currentCard.text : currentCard} round={round}
        playerName={players[currentPlayerIdx]}
        playerIndex={activeOrderIdx} totalPlayers={activeTotalForRound}
        activePlayers={activeTotalForRound}
        onChoose={handleChoose} onHome={goHome}
        onPlayerLeft={handlePlayerLeft} onExample={goExample}
      />
    );
    if (stage === 'votePin') return (
      <PlayerVotePin
        playerName={players[currentPlayerIdx]}
        playerIndex={activeOrderIdx} totalPlayers={activeTotalForRound}
        round={round}
        onConfirm={handlePinConfirm}
        onBack={() => { setPendingVote(null); setStage('voteChoice'); }}
        onHome={goHome} onPlayerLeft={handlePlayerLeft} onExample={goExample}
      />
    );
    if (stage === 'score') return (
      <Scoreboard
        question={typeof currentCard === 'object' ? currentCard.text : currentCard} round={round}
        players={players} votes={votes} skipped={skippedPlayers}
        onNext={nextRound} onHome={goHome} onExample={goExample}
      />
    );
    if (stage === 'deckEmpty') return (
      <DeckEmpty
        deck={selectedDeckIds.map(id => ALL_DECKS.find(d => d.id === id)).filter(Boolean)[0] || DECK_PROIBIDAO}
        onBuy={() => {
          const allCards = [];
          selectedDeckIds.forEach(deckId => {
            const d = ALL_DECKS.find(x => x.id === deckId);
            if (!d) return;
            const hasExt = hasExtension(deckId);
            const cards = hasExt ? d.cards : d.cards.slice(0, d.freeCount);
            cards.forEach(text => allCards.push({ text, deckId, deckEmoji: d.emoji, deckAccent: d.accentColor }));
          });
          const shuffled = shuffle(allCards);
          setCurrentCard(shuffled[0]); setDeck(shuffled.slice(1));
          setRound(round + 1); setVotes([]);
          setCurrentPlayerIdx(players.findIndex((_, i) => !skippedPlayers.includes(i)));
          setStage('card');
        }}
        onHome={goHome}
      />
    );
    if (stage === 'gameOver') return (
      <div style={{
        minHeight: '100vh', background: C.bg, display: 'flex',
        flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '2rem 1.4rem', maxWidth: '480px', margin: '0 auto', textAlign: 'center'
      }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏁</div>
        <div style={{ fontFamily: TITLE, fontWeight: 900, fontSize: '2rem', color: C.ink, letterSpacing: '-0.03em', marginBottom: '0.6rem' }}>
          Fim de jogo
        </div>
        <div style={{ fontFamily: BODY, fontSize: '0.9rem', color: C.inkMuted, lineHeight: 1.6, marginBottom: '2.5rem' }}>
          O mínimo de jogadores é 3 e não há jogadores suficientes para continuar.
        </div>
        <div style={{ width: '100%' }}>
          <Btn onClick={goHome} color={C.bg} bg={C.ink} border={C.ink}>Começar de novo</Btn>
        </div>
      </div>
    );
    return null;
  })();

  const bannerStyle = {
    verifying: { bg: '#111100', border: C.green, color: C.green, label: 'Verificando pagamento...' },
    success:   { bg: '#001a00', border: C.green, color: C.green, label: 'Baralho desbloqueado!' },
    failed:    { bg: '#1a0000', border: C.red,   color: C.red,   label: 'Pagamento não concluído.' },
  }[paymentBanner];

  return (
    <>
      {screen}
      {paymentBanner && (
        <div style={{
          position: 'fixed', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)',
          zIndex: 9999, background: bannerStyle.bg,
          border: `1.5px solid ${bannerStyle.border}`, borderRadius: '100px',
          padding: '0.7rem 1.5rem',
          fontFamily: BODY, fontSize: '0.82rem', color: bannerStyle.color,
          fontWeight: 600, whiteSpace: 'nowrap', boxShadow: '0 4px 24px rgba(0,0,0,0.6)',
        }}>
          {bannerStyle.label}
        </div>
      )}
    </>
  );
}

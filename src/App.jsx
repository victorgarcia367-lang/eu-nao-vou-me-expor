import React, { useState, useEffect, useCallback } from 'react';

// ============ BARALHO PROIBIDÃO +18 ============
// As 10 primeiras são grátis, o resto é premium
const DECK_PROIBIDAO = {
  id: 'proibidao',
  name: 'Proibidão +18',
  freeCount: 10,
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

const ALL_DECKS = [DECK_PROIBIDAO];

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

// ============ TELA 1: SETUP (baralho + jogadores) ============
function SetupCount({ onNext, onTutorial }) {
  const [count, setCount] = useState(4);
  const [selectedDeck, setSelectedDeck] = useState(DECK_PROIBIDAO);
  // isPremium: em produção viria do backend/localStorage após compra
  const [isPremium, setIsPremium] = useState(false);
  const [showBuySheet, setShowBuySheet] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState(false);

  // Cupons válidos (em produção ficam no backend)
  const VALID_COUPONS = ['PROIBIDAO2024', 'AMIGO', 'BETA'];

  const redeemCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (VALID_COUPONS.includes(code)) {
      setIsPremium(true);
      setCouponSuccess(true);
      setCouponError('');
      setTimeout(() => setShowBuySheet(false), 1200);
    } else {
      setCouponError('Cupom inválido ou já utilizado.');
    }
  };

  const deck = selectedDeck;
  const premiumCount = deck.totalCount - deck.freeCount;

  const cta = showBuySheet ? null : (
    <Btn onClick={() => onNext(count, selectedDeck, isPremium)} color={C.bg} bg={C.ink} border={C.ink}>
      Continuar
    </Btn>
  );

  return (
    <AppShell cta={cta}>
      {/* Logo */}
      <div style={{ paddingTop: '0.5rem', paddingBottom: '0.8rem', textAlign: 'center' }}>
        <div style={{
          fontFamily: TITLE, fontWeight: 900, fontSize: 'clamp(1.8rem, 6vw, 2.4rem)',
          letterSpacing: '-0.03em', color: C.ink, lineHeight: 0.95, marginBottom: '0.4rem'
        }}>
          EU NÃO VOU<br />ME EXPOR
        </div>
        <Tagline />
        <button
          onClick={onTutorial}
          style={{
            marginTop: '0.6rem', background: 'transparent',
            border: `1px solid ${C.border}`, borderRadius: '100px',
            padding: '0.25rem 0.9rem', cursor: 'pointer',
            fontFamily: BODY, fontSize: '0.65rem', color: C.inkMuted,
            fontWeight: 600, letterSpacing: '0.1em'
          }}
        >
          como jogar?
        </button>
      </div>

      {/* Seção baralho */}
      <div style={{
        background: C.card, border: `1.5px solid ${C.border}`,
        borderRadius: `${R}px`, padding: '0.9rem 1rem', marginBottom: '0.7rem', flexShrink: 0
      }}>
        <div style={{
          fontFamily: BODY, fontSize: '0.65rem', color: C.inkMuted,
          fontWeight: 700, letterSpacing: '0.15em', marginBottom: '0.8rem'
        }}>
          BARALHO
        </div>

        {/* Card do baralho selecionado */}
        <div style={{
          background: '#111', border: `2px solid ${C.green}`,
          borderRadius: `${R - 6}px`, padding: '0.9rem 1rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.7rem' }}>
            <div>
              <div style={{
                fontFamily: TITLE, fontWeight: 900, fontSize: '1rem',
                color: C.ink, letterSpacing: '-0.02em'
              }}>
                {deck.name}
              </div>
              <div style={{ fontFamily: BODY, fontSize: '0.65rem', color: C.inkMuted, marginTop: '0.15rem' }}>
                {isPremium
                  ? `${deck.totalCount} cartas · baralho completo`
                  : `${deck.freeCount} de ${deck.totalCount} cartas grátis`}
              </div>
            </div>
            {isPremium ? (
              <div style={{
                background: `${C.green}22`, border: `1px solid ${C.green}55`,
                borderRadius: '100px', padding: '0.2rem 0.6rem',
                fontFamily: BODY, fontSize: '0.58rem', color: C.green, fontWeight: 700
              }}>
                COMPLETO
              </div>
            ) : (
              <div style={{
                background: `${C.green}22`, border: `1px solid ${C.green}55`,
                borderRadius: '100px', padding: '0.2rem 0.6rem',
                fontFamily: BODY, fontSize: '0.58rem', color: C.green, fontWeight: 700
              }}>
                SELECIONADO
              </div>
            )}
          </div>

          {/* Badge desbloqueado OU botão de compra */}
          {isPremium ? (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: `${C.green}12`, border: `1px solid ${C.green}33`,
              borderRadius: '8px', padding: '0.5rem 0.7rem'
            }}>
              <div style={{
                width: '16px', height: '16px', borderRadius: '50%',
                background: `${C.green}33`, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: '0.65rem', color: C.green, flexShrink: 0
              }}>✓</div>
              <div style={{ fontFamily: BODY, fontSize: '0.7rem', color: C.green, fontWeight: 600 }}>
                Baralho completo desbloqueado
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowBuySheet(true)}
              style={{
                width: '100%', background: C.green, border: 'none',
                borderRadius: '9px', padding: '0.7rem 1rem',
                cursor: 'pointer', textAlign: 'center'
              }}
            >
              <div style={{ fontFamily: TITLE, fontWeight: 900, fontSize: '0.95rem', color: '#000', letterSpacing: '-0.01em' }}>
                Baralho completo
              </div>
              <div style={{ fontFamily: BODY, fontSize: '0.65rem', color: '#1a3d00', marginTop: '0.1rem', fontWeight: 500 }}>
                {deck.totalCount} cartas por {deck.price}
              </div>
            </button>
          )}
        </div>

        {/* Em breve */}
        <div style={{
          background: '#111', border: `1.5px solid ${C.border}`,
          borderRadius: `${R - 6}px`, padding: '0.6rem 0.9rem',
          marginTop: '0.5rem', opacity: 0.4,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div>
            <div style={{ fontFamily: TITLE, fontWeight: 900, fontSize: '0.85rem', color: C.ink }}>Mais baralhos</div>
            <div style={{ fontFamily: BODY, fontSize: '0.6rem', color: C.inkMuted, marginTop: '0.1rem' }}>em breve</div>
          </div>
          <div style={{
            background: '#1a1a1a', borderRadius: '100px', padding: '0.15rem 0.5rem',
            fontFamily: BODY, fontSize: '0.55rem', color: C.inkMuted, fontWeight: 700
          }}>
            EM BREVE
          </div>
        </div>
      </div>

      {/* Seção jogadores */}
      <div style={{
        background: C.card, border: `1.5px solid ${C.border}`,
        borderRadius: `${R}px`, padding: '0.9rem 1rem', marginBottom: '0.7rem', flexShrink: 0
      }}>
        <div style={{
          fontFamily: BODY, fontSize: '0.62rem', color: C.inkMuted,
          fontWeight: 700, letterSpacing: '0.15em', marginBottom: '0.7rem', textAlign: 'center'
        }}>
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
        <div style={{
          textAlign: 'center', fontFamily: BODY, fontSize: '0.62rem',
          color: C.inkMuted, marginTop: '0.6rem'
        }}>
          mín. 3 · máx. 20
        </div>
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
            {/* handle */}
            <div style={{
              width: '2rem', height: '3px', background: '#333',
              borderRadius: '2px', margin: '0 auto 1.2rem'
            }} />

            <div style={{ textAlign: 'center', marginBottom: '1.2rem' }}>
              <div style={{
                fontFamily: TITLE, fontWeight: 900, fontSize: '1.3rem',
                color: C.ink, letterSpacing: '-0.02em', marginBottom: '0.25rem'
              }}>
                {deck.name}
              </div>
              <div style={{ fontFamily: BODY, fontSize: '0.75rem', color: C.inkMuted }}>
                baralho completo · {deck.totalCount} cartas
              </div>
            </div>

            {/* Resumo */}
            <div style={{
              background: '#111', border: `1px solid ${C.border}`,
              borderRadius: `${R - 6}px`, padding: '0.9rem 1rem', marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div style={{ fontFamily: BODY, fontSize: '0.78rem', color: C.inkSoft }}>
                  {deck.freeCount} cartas grátis
                </div>
                <div style={{ fontFamily: BODY, fontSize: '0.78rem', color: C.green, fontWeight: 700 }}>incluso</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                <div style={{ fontFamily: BODY, fontSize: '0.78rem', color: C.inkSoft }}>
                  {premiumCount} cartas premium
                </div>
                <div style={{ fontFamily: BODY, fontSize: '0.78rem', color: C.ink, fontWeight: 700 }}>desbloqueadas</div>
              </div>
              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: '0.7rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontFamily: BODY, fontSize: '0.85rem', color: C.ink, fontWeight: 700 }}>Total</div>
                <div style={{ fontFamily: TITLE, fontWeight: 900, fontSize: '1.3rem', color: C.green, letterSpacing: '-0.02em' }}>
                  {deck.price}
                </div>
              </div>
            </div>

            {/* Botão comprar */}
            <button
              onClick={() => alert('Pagamento em breve! Use um cupom por enquanto.')}
              style={{
                width: '100%', background: C.green, border: 'none',
                borderRadius: `${R - 6}px`, padding: '0.95rem',
                cursor: 'pointer', marginBottom: '0.8rem'
              }}
            >
              <div style={{ fontFamily: TITLE, fontWeight: 900, fontSize: '1rem', color: '#000' }}>
                Comprar agora · {deck.price}
              </div>
              <div style={{ fontFamily: BODY, fontSize: '0.68rem', color: '#1a3d00', marginTop: '0.1rem' }}>
                pix · cartão · em breve
              </div>
            </button>

            {/* Cupom */}
            <div style={{ marginBottom: '0.8rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  value={couponInput}
                  onChange={e => { setCouponInput(e.target.value); setCouponError(''); }}
                  placeholder="Tem um cupom?"
                  style={{
                    flex: 1, background: '#111', border: `1px solid ${C.border}`,
                    borderRadius: '10px', padding: '0.65rem 0.9rem',
                    color: C.ink, fontFamily: BODY, fontSize: '0.85rem',
                    outline: 'none', letterSpacing: '0.02em'
                  }}
                />
                <button
                  onClick={redeemCoupon}
                  style={{
                    background: 'transparent', border: `1px solid ${C.border}`,
                    borderRadius: '10px', padding: '0.65rem 1rem',
                    color: C.ink, fontFamily: BODY, fontSize: '0.8rem',
                    fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap'
                  }}
                >
                  Aplicar
                </button>
              </div>
              {couponError && (
                <div style={{ fontFamily: BODY, fontSize: '0.7rem', color: C.red, marginTop: '0.4rem' }}>
                  {couponError}
                </div>
              )}
              {couponSuccess && (
                <div style={{ fontFamily: BODY, fontSize: '0.7rem', color: C.green, marginTop: '0.4rem', fontWeight: 600 }}>
                  Cupom aplicado! Baralho completo desbloqueado.
                </div>
              )}
            </div>

            <div style={{
              textAlign: 'center', fontFamily: BODY, fontSize: '0.65rem', color: C.inkMuted
            }}>
              compra única · disponível em todos seus dispositivos
            </div>
          </div>
        </div>
      )}
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
function CardReveal({ question, round, onStart, onHome, onSkip, onExample }) {
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
function DeckEmpty({ deck, isPremium, onBuy, onHome }) {
  const [showBuySheet, setShowBuySheet] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState(false);

  const VALID_COUPONS = ['PROIBIDAO2024', 'AMIGO', 'BETA'];

  const redeemCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (VALID_COUPONS.includes(code)) {
      setCouponSuccess(true);
      setCouponError('');
      setTimeout(() => { setShowBuySheet(false); onBuy(); }, 1200);
    } else {
      setCouponError('Cupom inválido ou já utilizado.');
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
              onClick={() => alert('Pagamento em breve! Use um cupom por enquanto.')}
              style={{
                width: '100%', background: C.green, border: 'none',
                borderRadius: `${R - 6}px`, padding: '0.95rem',
                cursor: 'pointer', marginBottom: '0.8rem'
              }}
            >
              <div style={{ fontFamily: TITLE, fontWeight: 900, fontSize: '1rem', color: '#000' }}>Comprar agora · {deck.price}</div>
              <div style={{ fontFamily: BODY, fontSize: '0.68rem', color: '#1a3d00', marginTop: '0.1rem' }}>pix · cartão · em breve</div>
            </button>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.8rem' }}>
              <input
                value={couponInput}
                onChange={e => { setCouponInput(e.target.value); setCouponError(''); }}
                placeholder="Tem um cupom?"
                style={{
                  flex: 1, background: '#111', border: `1px solid ${C.border}`,
                  borderRadius: '10px', padding: '0.65rem 0.9rem',
                  color: C.ink, fontFamily: BODY, fontSize: '0.85rem', outline: 'none'
                }}
              />
              <button onClick={redeemCoupon} style={{
                background: 'transparent', border: `1px solid ${C.border}`,
                borderRadius: '10px', padding: '0.65rem 1rem',
                color: C.ink, fontFamily: BODY, fontSize: '0.8rem',
                fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap'
              }}>
                Aplicar
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

// ============ APP PRINCIPAL ============
export default function App() {
  const [stage, setStage] = useState('onboarding'); // onboarding, setupCount, setupNames, card, voteChoice, votePin, score, gameOver, deckEmpty, example
  const [prevStage, setPrevStage] = useState(null); // para voltar do exemplo
  const [playerCount, setPlayerCount] = useState(4);
  const [selectedDeck, setSelectedDeck] = useState(DECK_PROIBIDAO);
  const [isPremiumUnlocked, setIsPremiumUnlocked] = useState(false);

  const goExample = () => { setPrevStage(stage); setStage('example'); };
  const closeExample = () => setStage(prevStage || 'setupCount');
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

  const startGame = (names, deck, isPremium) => {
    setPlayers(names);
    const cards = isPremium ? deck.cards : deck.cards.slice(0, deck.freeCount);
    const d = shuffle(cards);
    setCurrentCard(d[0]); setDeck(d.slice(1));
    setRound(1); setVotes([]); setCurrentPlayerIdx(0);
    setSkippedPlayers([]);
    setStage('card');
  };

  const goHome = () => {
    setStage('setupCount');
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

  if (stage === 'onboarding') return <Onboarding onDone={() => setStage('setupCount')} />;
  if (stage === 'example') return <ExampleScreen onClose={closeExample} />;
  if (stage === 'setupCount') return (
    <SetupCount
      onNext={(c, deck, isPremium) => {
        setPlayerCount(c);
        setSelectedDeck(deck);
        setIsPremiumUnlocked(isPremium);
        setStage('setupNames');
      }}
      onTutorial={() => { setPrevStage('setupCount'); setStage('onboarding'); }}
    />
  );
  if (stage === 'setupNames') return (
    <SetupNames
      initialCount={playerCount}
      onNext={(names) => startGame(names, selectedDeck, isPremiumUnlocked)}
      onBack={() => setStage('setupCount')}
    />
  );
  if (stage === 'card') return (
    <CardReveal
      question={currentCard}
      round={round}
      onHome={goHome}
      onStart={() => setStage('voteChoice')}
      onSkip={() => { if (deck.length === 0) { setStage('deckEmpty'); } else { drawCard(deck); } }}
      onExample={goExample}
    />
  );
  if (stage === 'voteChoice') return (
    <PlayerVoteChoice
      question={currentCard} round={round}
      playerName={players[currentPlayerIdx]}
      playerIndex={activeOrderIdx} totalPlayers={activeTotalForRound}
      activePlayers={activeTotalForRound}
      onChoose={handleChoose}
      onHome={goHome}
      onPlayerLeft={handlePlayerLeft}
      onExample={goExample}
    />
  );
  if (stage === 'votePin') return (
    <PlayerVotePin
      playerName={players[currentPlayerIdx]}
      playerIndex={activeOrderIdx} totalPlayers={activeTotalForRound}
      round={round}
      onConfirm={handlePinConfirm}
      onBack={() => { setPendingVote(null); setStage('voteChoice'); }}
      onHome={goHome}
      onPlayerLeft={handlePlayerLeft}
      onExample={goExample}
    />
  );
  if (stage === 'score') return (
    <Scoreboard
      question={currentCard} round={round}
      players={players} votes={votes} skipped={skippedPlayers}
      onNext={nextRound} onHome={goHome} onExample={goExample}
    />
  );
  if (stage === 'deckEmpty') return (
    <DeckEmpty
      deck={selectedDeck}
      isPremium={isPremiumUnlocked}
      onBuy={() => {
        setIsPremiumUnlocked(true);
        const cards = selectedDeck.cards;
        const d = shuffle(cards);
        setCurrentCard(d[0]); setDeck(d.slice(1));
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
      <div style={{
        fontFamily: TITLE, fontWeight: 900, fontSize: '2rem',
        color: C.ink, letterSpacing: '-0.03em', marginBottom: '0.6rem'
      }}>
        Fim de jogo
      </div>
      <div style={{
        fontFamily: BODY, fontSize: '0.9rem', color: C.inkMuted,
        lineHeight: 1.6, marginBottom: '2.5rem'
      }}>
        O mínimo de jogadores é 3 e não há jogadores suficientes para continuar.
      </div>
      <div style={{ width: '100%' }}>
        <Btn onClick={goHome} color={C.bg} bg={C.ink} border={C.ink}>
          Começar de novo
        </Btn>
      </div>
    </div>
  );

  return null;
}

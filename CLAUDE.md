# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start dev server (Vite HMR)
npm run build     # production build
npm run lint      # ESLint
npm run preview   # preview production build locally

node seed-coupons.mjs   # seed coupon codes into Firestore (requires .env)
```

There are no tests in this project.

## Environment

All Firebase config is read from environment variables prefixed with `VITE_`. Create a `.env` file at the root with:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

`seed-coupons.mjs` reads the same keys without the `VITE_` prefix via `dotenv` — use a single `.env` file, both will work.

## Architecture

**Single-page React app with no client-side router.** Navigation is entirely screen-state driven via `useState` inside `App.jsx`. There are effectively two separate apps served from the same domain:

- `/` → `App.jsx` — the player-facing game
- `/admin` → `Admin.jsx` — the admin panel (separate auth flow, hardcoded to `ADMIN_EMAIL`)

`vercel.json` rewrites all paths to `index.html`; `main.jsx` chooses which root component to mount based on `window.location.pathname`.

### Firebase collections

| Collection | Purpose |
|---|---|
| `users/{uid}` | User profile + `purchases` map keyed by `deckId` |
| `purchases/{uid}_{deckId}` | Flat purchase log (for admin reporting) |
| `coupons/{CODE}` | Single-use coupon codes; `usedBy` is set on redemption |

### Auth & premium (`AuthContext.jsx`)

`AuthProvider` wraps the app and exposes `useAuth()`. Premium status (`isPremium`) is derived from `users/{uid}.purchases` — if the map has any keys, the user is considered premium. Key methods:

- `signInWithGoogle()` — popup-based Google auth
- `registerPurchase(deckId, source, couponCode?)` — writes to both `users` and `purchases` collections
- `redeemCoupon(code, deckId)` — validates the coupon in Firestore, marks it used, then calls `registerPurchase`

### Design tokens (`App.jsx` top section)

All colors, fonts, and border-radius are defined as module-level constants:

- `C` — color palette object (bg, card, ink, green, red, blue, etc.)
- `R` — border radius (22px)
- `TITLE` / `BODY` — font stack strings (Archivo / Inter)

Both `App.jsx` and `Admin.jsx` define their own local copies of `C`, `TITLE`, and `BODY` — they are not shared via an import.

### App screen flow

All screens in `App.jsx` are local function components rendered by a central `view` state variable. The layout wrapper is `AppShell`, which provides a fixed header, scrollable content area, and a sticky bottom CTA slot. The game deck (`DECK_PROIBIDAO`) is defined as a constant at the top of `App.jsx` — the first `freeCount` (10) cards are free, the rest require premium.

Full stage sequence: `AgeGate → onboarding → setupCount → setupNames → card → voteChoice → votePin → score → gameOver/deckEmpty`

## Design System

All tokens are defined on the module-level constants `C`, `R`, `TITLE`, and `BODY` — do not introduce a separate design-token file.

| Token | Value |
|---|---|
| `C.bg` | `#000000` |
| `C.green` | `#9fff3d` |
| `C.red` | `#ff3d5a` |
| `C.blue` | `#7b87ff` |
| `R` | `22` (px, border-radius) |
| `TITLE` | Archivo, weight 900 |
| `BODY` | Inter |

## Monetisation

- **Deck "Proibidão"**: 10 free cards + 31 premium cards. Free threshold is the `freeCount` constant in `App.jsx`.
- **Coupons**: single-use, stored in `coupons/{CODE}`. Redemption sets `usedBy` to the user's UID — one use per UID enforced by `redeemCoupon()` in `AuthContext.jsx`.
- **Admin panel**: `/admin` is protected by checking the signed-in user's email against `ADMIN_EMAIL`, which is hardcoded to `victorgarcia367@gmail.com`. Do not change this to an env var without updating the Firestore security rules accordingly.

## Deployment

- **Host**: Vercel. All routes rewritten to `index.html` via `vercel.json`.
- **Firebase project**: uses Firestore + Firebase Auth (Google provider).
- **Firestore rules**: currently in dev/open mode — migration to production rules is a pending priority.

## Pending priorities (as of 2026-05-14)

1. **Mercado Pago integration** — implement payment flow via Vercel Functions (serverless). The function should verify the payment server-side and call `registerPurchase` logic with elevated privileges.
2. **Firestore security rules** — migrate from open dev rules to production rules that enforce per-user access and coupon anti-fraud constraints.
3. **PWA manifest** — add `manifest.json` and service worker so the game is installable on mobile.

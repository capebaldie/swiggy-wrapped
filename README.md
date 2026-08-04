# Swiggy Wrapped

A mobile-first personal food spending analytics dashboard. Connect your Swiggy account and see your year in food — monthly spending, favourite cuisines, top restaurants, ordering habits, and a Spotify-Wrapped-style yearly summary you can share.

## Stack

- **Next.js 16** App Router + TypeScript (server components; no client data-fetching layer)
- **Tailwind CSS v4** with a warm-neutral design system
- **Recharts** for monthly spending charts
- **Lucide** icons
- **next-themes** for light/dark mode
- **html-to-image** + Web Share API for the share card

## Getting started

```bash
pnpm install
cp .env.example .env    # set SESSION_SECRET
pnpm dev                # http://localhost:3000
```

On the login page, paste your swiggy.com cookie (log in on swiggy.com, then export the cookie
string with a Cookie-Editor browser extension). It is validated against Swiggy, stored `httpOnly`,
and never leaves the server.

### Environment

| Variable | Purpose |
|---|---|
| `SESSION_SECRET` | HMAC secret for the session cookie. **Change in production.** |

## Project structure

```
src/
├── app/
│   ├── page.tsx                    # / login (paste cookie)
│   ├── (app)/                      # authenticated group (bottom nav)
│   │   ├── dashboard/
│   │   ├── orders/
│   │   ├── wrapped/                # full-screen swipe story
│   │   ├── insights/
│   │   └── settings/
│   └── api/
│       ├── auth/logout/
│       ├── settings/swiggy-cookie/ # POST validate+store, DELETE disconnect
│       ├── orders/
│       ├── analytics/{summary,wrapped}/
│       └── insights/
├── components/                     # StatCard, OrderCard, WrappedStory, CookieForm…
├── lib/
│   ├── cookies.ts                  # cookie names (edge-safe, import-free)
│   ├── auth/session.ts             # httpOnly cookie + HMAC
│   ├── swiggy/dapi.ts              # Swiggy order-history fetch + Order mapping
│   ├── swiggy/orders.ts            # getAllOrders / getOrders / getOrder (+ cache)
│   └── analytics/                  # pure analytics functions
├── types/
└── middleware.ts                   # protects /dashboard /orders /wrapped …

scripts/test-dapi-map.ts            # self-check for the Swiggy → Order mapper
```

## Architecture

### Data source

Order history comes from Swiggy's own web endpoint, `GET https://www.swiggy.com/dapi/order/all`,
authenticated by the user's swiggy.com cookie. `src/lib/swiggy/dapi.ts` paginates it (10 orders per
call, keyed on the last `order_id`) and maps each raw order onto the internal `Order` type.

`src/lib/swiggy/orders.ts` is the only module pages and route handlers import from. It reads the
stored cookie, caches the mapped list in process memory for 5 minutes, and exposes:

- `getAllOrders(userId)` — everything, newest first
- `getOrders({ userId, from, to, cuisine, cursor, limit })` — filtered + cursor-paginated
- `getOrder(userId, orderId)` — one order

An expired cookie yields an empty list rather than an error; the user pastes a fresh one in
**Settings → Reconnect Swiggy**.

Run the mapper self-check against a real API response:

```bash
pnpm test:map ~/Downloads/all.json    # skips silently if the file is absent
```

### Analytics

All analytics functions in `src/lib/analytics/` are pure: they take `Order[]` and return typed
values. No I/O, no DB. Money is integer paise throughout to avoid float drift; `formatINR` renders
rupees. Pages scope orders to the selected year with `lib/analytics/years.ts` before summarising.

Insights are rule-based — no AI generation. See `src/lib/analytics/insights.ts` for the rule set.

### Auth

There is no user database. The Swiggy cookie *is* the credential: `POST /api/settings/swiggy-cookie`
validates it, stores it `httpOnly`, and opens an HMAC-signed session keyed on the Swiggy customer
id. `src/middleware.ts` requires both cookies on protected routes.

## Available pages

- `/` — Connect
- `/dashboard` — Overview, stat cards, monthly chart, recent orders, year selector
- `/orders` — Filterable list of all orders
- `/orders/[id]` — Itemised bill breakdown
- `/wrapped` — 7-slide swipeable yearly story with share card
- `/insights` — Rule-based insights, day/hour heatmaps, top items
- `/settings` — Profile, theme, reconnect Swiggy, logout

## Deploy to Vercel

1. Push to GitHub.
2. Import the repo on Vercel.
3. Set `SESSION_SECRET` in the project's environment variables.

No database required. Note that the 5-minute order cache lives in process memory, so on a
multi-instance deployment each instance keeps its own — swap it for Redis if that matters.

## License

MIT

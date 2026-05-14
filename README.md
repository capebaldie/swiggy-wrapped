# Swiggy Wrapped

A mobile-first personal food spending analytics dashboard. Connect your Swiggy account (via MCP) and see your year in food — monthly spending, favourite cuisines, top restaurants, ordering habits, and a Spotify-Wrapped-style yearly summary you can share.

Built for the [Swiggy Builders Club](https://mcp.swiggy.com/builders/).

## Stack

- **Next.js 15** App Router + TypeScript
- **Tailwind CSS** with a warm-neutral design system (no neon, no glassmorphism)
- **Recharts** for monthly spending charts
- **Lucide** icons
- **TanStack Query** for client cache
- **next-themes** for light/dark mode
- **Prisma** schema (ready for Postgres in v2)
- **html-to-image** + Web Share API for the share card
- **Swiggy MCP** integration layer with a mock client for local development

## Getting started

```bash
pnpm install
pnpm seed:mock         # generates data/mock-orders.json (140 orders)
pnpm dev               # http://localhost:3000
```

Then click **Continue with Swiggy** on the login page to sign in as the demo user.

### Environment

Copy `.env.example` to `.env` and update the values:

| Variable | Purpose |
|---|---|
| `SESSION_SECRET` | HMAC secret for the session cookie. **Change in production.** |
| `SWIGGY_MCP_MODE` | `"mock"` (default) reads from `data/mock-orders.json`; `"prod"` wires up the real MCP client. |
| `DATABASE_URL` | Only required for v2 (Postgres + Prisma). |

## Project structure

```
src/
├── app/
│   ├── page.tsx                    # / login
│   ├── (app)/                      # authenticated group (bottom nav)
│   │   ├── dashboard/
│   │   ├── orders/
│   │   ├── wrapped/                # full-screen swipe story
│   │   ├── insights/
│   │   └── settings/
│   └── api/
│       ├── auth/{login,logout,me}/
│       ├── orders/
│       ├── analytics/{summary,wrapped}/
│       └── insights/
├── components/                     # StatCard, OrderCard, WrappedStory…
├── lib/
│   ├── auth/session.ts             # httpOnly cookie + HMAC
│   ├── mcp/                        # client interface + mock + prod stub
│   ├── analytics/                  # pure analytics functions
│   └── query/provider.tsx
├── types/
└── middleware.ts                   # protects /dashboard /orders /wrapped …

prisma/schema.prisma                # User, Order, OrderItem, Restaurant, AnalyticsCache
scripts/generate-mock-orders.ts     # deterministic seed
data/mock-orders.json               # generated; not committed
```

## Architecture

### MCP integration

Every API route imports from `@/lib/mcp` — never from a concrete client file. `getMcpClient()` returns:

- **`MockClient`** in development: reads from `data/mock-orders.json`, filters in memory.
- **`ProdClient`** when `SWIGGY_MCP_MODE=prod`: stubbed today; replace with real Swiggy MCP calls.

To go live, implement the `SwiggyMCPClient` interface in `src/lib/mcp/prod-client.ts` and flip the env var.

### Analytics

All analytics functions in `src/lib/analytics/` are pure: they take `Order[]` and return typed values. No I/O, no DB. Money is stored as integer paise throughout to avoid float drift; the `formatINR` helper renders rupees.

Insights are rule-based — no AI generation. See `src/lib/analytics/insights.ts` for the rule set.

### Auth

`/api/auth/login` always signs in the demo user in v1. The session cookie is HMAC-signed with `SESSION_SECRET`. `src/middleware.ts` enforces the cookie on protected routes. Replace `authProvider` in `src/lib/auth/session.ts` to wire up the real Swiggy MCP OAuth.

## Available pages

- `/` — Login
- `/dashboard` — Overview, stat cards, monthly chart, recent orders
- `/orders` — Filterable list of all orders
- `/orders/[id]` — Itemised bill breakdown
- `/wrapped` — 7-slide swipeable yearly story with share card
- `/insights` — Rule-based insights, day/hour heatmaps, top items
- `/settings` — Profile, theme toggle, logout

## Mock dataset

`scripts/generate-mock-orders.ts` produces 140 orders across 15 Bangalore restaurants, spread across one year. The generator uses a deterministic seed (`seedrandom("swiggy-wrapped-v1")`) so the same dataset is produced on every run. Run it any time to refresh:

```bash
pnpm seed:mock
```

## Deploy to Vercel

1. Push to GitHub.
2. Import the repo on Vercel.
3. Set `SESSION_SECRET` in the project's environment variables.
4. Add a build step before `next build` to regenerate the mock data: `pnpm seed:mock && next build` — or commit `data/mock-orders.json` if you want a fixed dataset.

That's it. No database required for the demo.

## Going to production

1. Implement `ProdClient` in `src/lib/mcp/prod-client.ts` against the real Swiggy MCP.
2. Replace `authProvider` in `src/lib/auth/session.ts` with real OAuth.
3. Provision Postgres, set `DATABASE_URL`, install `@prisma/client`, run migrations.
4. Restore the Prisma singleton in `src/lib/prisma.ts` (see the comment in that file).
5. Add an `AnalyticsCache` write path so `/api/analytics/wrapped` doesn't recompute on every request.

## License

MIT

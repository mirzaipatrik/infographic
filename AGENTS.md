# Infographic Builder — Agent Instructions

Next.js App Router app that renders a single shared community infographic. Content lives in Supabase; visitors preview, authenticated admins edit and save.

## Tech stack

- **Next.js 16** (App Router, React 19, `cacheComponents: true`)
- **TypeScript** (strict mode)
- **Tailwind CSS 4** (existing visual system — keep stone/teal tokens, print styles in `app/globals.css`)
- **Supabase** (Postgres + Auth + RLS)
- **pnpm** as the package manager

This is **not** the Next.js you know from older training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing code. Heed deprecation notices (`proxy.ts` not `middleware.ts`; `updateTag()` in server actions).

## Commands

```bash
pnpm install
pnpm dev              # gen-types then Next.js
pnpm dev:no-types     # Next.js only
pnpm gen-types        # regenerate lib/database.types.ts from the remote schema
pnpm db:setup         # db push + seed.sql (requires supabase link)
pnpm lint
```

Copy `.env.example` to `.env.local` before running locally.

## Project layout

```
app/                    # Routes, layouts, server actions
components/             # UI: Infographic, Editor, HomeClient
lib/
  supabase/             # Infra clients (server, public, admin, browser, proxy, env)
  auth.ts               # getClaims(), isAdmin(), requireAuthClaims()
  infographic.ts        # Cached public read
  data.ts               # InfographicData + parseInfographicData()
  cache.ts              # Cache tag registry
  rate-limit.ts         # Login throttling
types/                  # Ambient env types
supabase/               # migrations/ = schema; seed.sql = demo row
scripts/                # Typegen + db setup
```

## Code quality

All changes must be **production-worthy**: correct, maintainable, and ready to ship.

- Prefer straightforward, explicit solutions. Handle real failure modes (missing env, auth failures, invalid JSONB) with clear behavior — not empty `catch` blocks or `@ts-ignore`.
- Match existing project patterns before introducing new conventions. Keep Tailwind and the current visual design; do not restyle to another site.
- Use the `@/` alias. Prefer `import type` for type-only imports.
- Match existing formatting: **2-space indent**, semicolons, trailing commas.
- Add comments only for non-obvious cache, auth, or RLS rules.

## Core conventions

### Server vs client

- **Server components** (default): data fetching, `'use cache'`, auth checks.
- **Client components** (`"use client"`): editor, print button, save UI.
- Pattern: async server wrapper fetches data → passes props to a `Client*` component (`app/page.tsx` → `HomeClient`).

### Supabase clients

| Client | File | Use |
|--------|------|-----|
| Cookie SSR | `lib/supabase/server.ts` | Session, login/logout, `getClaims()` |
| Cookie-less public | `lib/supabase/public.ts` | `'use cache'` reads (cannot access cookies) |
| Secret / service | `lib/supabase/admin.ts` | Authenticated writes after `requireAuthClaims()` |
| Browser | `lib/supabase/client.ts` | Client-side Auth if needed |
| Proxy refresh | `lib/supabase/proxy.ts` | Session refresh in `proxy.ts` |

Never import `lib/supabase/admin.ts` from client code. Never use `getSession()` as proof of identity — use `getClaims()`.

### Auth

- Public routes: `/` and `/login`. Proxy refreshes cookies but does **not** redirect (a new Response can drop the refreshed session).
- `isAdmin()` / `requireAuthClaims()` verify the JWT. If `ADMIN_EMAILS` is set, the claim email must be on that list.
- Writes: server action checks auth, validates the payload, then upserts with the secret key. RLS is **SELECT-only** for `anon` / `authenticated`.
- Disable public signups in the Supabase dashboard.

### Caching

- `cacheComponents: true` in `next.config.ts`.
- Tag cached reads with `INFOGRAPHIC_CACHE_TAGS` from `lib/cache.ts`.
- After mutations, call `updateTag()` (server-action read-your-own-writes). Do not add `'use cache'` without tags.

### Data

- Overlay generated types in `lib/database.ts` (`MergeDeep`) so `content` is `InfographicData`, not `Json`.
- Validate on **save and read** with `parseInfographicData()` in `lib/data.ts`. Invalid stored JSON falls back to `defaultData`.
- `lib/database.types.ts` is generated — do not edit by hand.

## What to avoid

- Do not commit secrets (`.env`, `.env.local`).
- Do not edit `lib/database.types.ts` manually.
- Do not grant Data API INSERT/UPDATE to `anon` or `authenticated`.
- Do not redirect inside `lib/supabase/proxy.ts` after `getClaims()`.
- Do not copy styled-components / 4-space indent from other repos; this app uses Tailwind and 2-space indent.

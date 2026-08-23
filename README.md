Welcome to the repo of the Infographic Builder.

Visitors preview a single shared community infographic. Authenticated admins edit and save. Content is stored in Supabase.

## Tech Stack

This project is built using the following tech stack:

- Next.js for the App Router frontend (React 19, Cache Components)
- TypeScript as language for the project to ensure type safety
- ESLint for linting
- Tailwind CSS for styling
- Supabase for Postgres, Auth, and Row Level Security
- pnpm as package manager

## Installation Notes

### 1. Setup

#### NodeJS

To be able to run the project locally, first you need to have Node.js 20 or later installed on your machine. You could either use nvm to manage your node versions or download and install the specific version of node manually. ([here](https://nodejs.org/))

**(OPTIONAL) Install nvm**

nvm (node version manager) will be helpful to have and can be installed per instructions at https://github.com/nvm-sh/nvm

There are sometimes issues with mac installations of nvm, follow troubleshooting instructions in the nvm project README.

#### Package Manager

This project uses pnpm as package manager. To have pnpm installed on your machine, you can either use corepack that comes bundled with Node.js starting from version 16.10.0, or you can install pnpm globally using npm:

```bash
npm install -g pnpm
```

### 2. Environment Variables

To run the project locally, you need to have a `.env` or `.env.local` file in the root of the project.
You can start from the template:

```bash
cp .env.example .env.local
```

Create a [Supabase](https://supabase.com) project, then fill in the variables from **Project Settings → API Keys** (use the publishable key, not the legacy anon key) and **Settings → General** (project ref).

The environment variable file should contain the following environment variables:

```env
# Public Supabase API (Dashboard → Project Settings → API Keys)
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...

# Project ref (Dashboard URL or Settings → General). Used by `pnpm gen-types`.
NEXT_PUBLIC_SUPABASE_PROJECT_ID=YOUR_PROJECT_REF

# Server-only secret key (Dashboard → API Keys). Required to save. Never expose to the client.
SUPABASE_SECRET_KEY=sb_secret_...

# Optional. Comma-separated emails allowed to edit. If unset, any authenticated user can save.
# ADMIN_EMAILS=you@example.com
```

Without the public env vars the app still loads using the in-code `defaultData` fallback. Saving requires `SUPABASE_SECRET_KEY`.

### 3. Database

SQL is split the usual Supabase way:

| File | What it is | When it runs |
|------|------------|--------------|
| `supabase/migrations/*.sql` | Schema (table, grants, RLS) | Once, in timestamp order |
| `supabase/seed.sql` | Demo infographic row | Re-runnable upsert |

After `.env.local` is filled in:

```bash
pnpm exec supabase login
pnpm exec supabase link --project-ref YOUR_PROJECT_REF
pnpm db:setup
pnpm gen-types
```

`pnpm db:setup` pushes migrations and then seeds. `pnpm gen-types` writes `lib/database.types.ts` from the remote schema. If typegen is skipped (missing project id or unauthenticated CLI), the committed types file is used instead. Do not edit that file by hand.

No CLI? Paste the migration file, then `seed.sql`, into the Dashboard SQL Editor (schema first).

### 4. Auth

In the Supabase dashboard:

1. Authentication → Users → create an admin user
2. Disable public signups so only accounts you create can sign in
3. Optionally set `ADMIN_EMAILS` in `.env.local` to an allowlist of those emails

The public Data API can only **read**. Saves go through the `saveInfographic` server action, which verifies the session (`getClaims()`), optionally checks `ADMIN_EMAILS`, validates the payload, then writes with the secret key.

### 5. Install Dependencies

Before running the project, you need to install the dependencies. You can do this by running the following command:

```bash
pnpm install
```

### 6. Start a Development Server

You can start the development server by running the following command:

```bash
pnpm dev
```

This will:

- Regenerate `lib/database.types.ts` from the remote schema (skipped if the CLI is not ready)
- Start the Next.js development server on `http://localhost:3000`

Open [http://localhost:3000](http://localhost:3000) in your browser.

To skip typegen:

```bash
pnpm dev:no-types
```

### 7. Build the Project

To build the project, you can use the following command:

```bash
pnpm build
```

The build process will:

1. Build the Next.js application
2. Optimize assets and generate the production output

### 8. Linting

To run the linting, you can use the following command:

```bash
pnpm lint
```

## Revalidation Tags

To be able to revalidate the cached infographic after an admin save, we use a small set of cache tags.

To see the tags used in the project, check [lib/cache.ts](./lib/cache.ts).

The project uses Next.js Cache Components (`cacheComponents: true` in `next.config.ts`). The published infographic is loaded in a `'use cache'` function, tagged with `INFOGRAPHIC_CACHE_TAGS`, and invalidated from the save server action via `updateTag()` (read-your-own-writes).

### Example Usage

```tsx
import { cacheLife, cacheTag } from "next/cache";
import { INFOGRAPHIC_CACHE_TAGS } from "@/lib/cache";

async function getPublishedInfographicCached() {
  "use cache";
  cacheLife("hours");
  INFOGRAPHIC_CACHE_TAGS.forEach((tag) => cacheTag(tag));
  // fetch from Supabase…
}
```

To invalidate cached data after a mutation, use `updateTag()` in a Server Action:

```tsx
"use server";

import { updateTag } from "next/cache";
import { INFOGRAPHIC_CACHE_TAGS } from "@/lib/cache";

export async function saveInfographic(/* … */) {
  // upsert to Supabase…
  INFOGRAPHIC_CACHE_TAGS.forEach((tag) => updateTag(tag));
  return { ok: true as const };
}
```

## About

A Next.js app for building and printing a shared community infographic.

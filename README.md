# Roots2Branches Project Hub

A production-ready, lean workspace for a small charity to plan projects, track dates, save resources, and capture impact stories.

## Stack
- React + TypeScript + Vite
- React Router
- Tailwind CSS v4
- React Hook Form + Zod
- TanStack Query
- Supabase (Auth, Postgres, RLS)

## Run
```bash
npm install
npm run dev
```

## Supabase setup
1. Create a Supabase project.
2. Apply `supabase/schema.sql`.
3. Create profiles for users with role `admin` or `member`.
4. Copy `.env.example` to `.env` and add URL + anon key.

## Product scope (V1)
- Project planning and status tracking
- Calendar dates
- Resource links
- Impact story capture
- Trustee/funder-ready overview cards

No enterprise workflow, no heavy analytics, no complex permissions matrix.

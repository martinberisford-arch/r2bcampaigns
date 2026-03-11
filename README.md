# Roots2Branches Project Hub

A warm, low-admin planning and impact workspace for a small community charity.

## Stack
- React + TypeScript + Vite
- React Router
- React Hook Form + Zod
- TanStack Query
- Supabase (Auth, Postgres, Realtime, RLS)

## Navigation
- Home
- Projects
- Calendar
- Outcomes
- Resources
- Settings

## Local setup
```bash
npm install
cp .env.example .env
npm run dev
```

## Supabase setup
1. Create a Supabase project.
2. Run `supabase/schema.sql` in SQL editor.
3. Optionally run `supabase/seed.sql` for demo content.
4. Add Vercel env vars:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

## Notes
- If Supabase tables are missing or unavailable, list views fall back to in-repo mock data.
- Realtime invalidation hook is scaffolded in `src/lib/supabase/realtime.ts`.

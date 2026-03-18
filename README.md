# CWTH Events & Training Calendar

A full-stack web application providing a central events and training calendar for Coventry & Warwickshire Training Hub (CWTH). Primary care staff across GP practices, PCNs, and the wider CWTH network can view upcoming events, filter by category, and click through to booking pages. Admins manage all event data via a password-protected panel and can send a formatted weekly digest email to the team.

**Stack:** Next.js 14 (App Router) · Tailwind CSS · Supabase (Postgres + Auth) · Resend · Vercel

---

## Local Setup

```bash
# 1. Clone the repository
git clone <repo-url>
cd cwth-events-calendar

# 2. Install dependencies
npm install

# 3. Copy environment variables
cp .env.example .env.local

# 4. Fill in .env.local with your Supabase and Resend credentials (see below)

# 5. Set up the Supabase database (see Supabase Setup section)

# 6. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the calendar.

---

## Environment Variables

Edit `.env.local` with these values:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL (from Supabase → Settings → API) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only — never prefix with NEXT_PUBLIC_) |
| `RESEND_API_KEY` | From [Resend dashboard](https://resend.com) — used for digest emails |
| `DIGEST_RECIPIENT_EMAIL` | Email address digest is sent to (e.g. `team@cwtraininghub.co.uk`) |
| `NEXT_PUBLIC_CALENDAR_URL` | Full URL of the deployed app (e.g. `https://calendar.cwtraininghub.co.uk`) |
| `ADMIN_EMAIL` | Shown in email footer (e.g. `admin@cwtraininghub.co.uk`) |

---

## Supabase Setup

### 1. Create a Supabase Project
Go to [supabase.com](https://supabase.com), create a new project, and note your Project URL and API keys from **Settings → API**.

### 2. Run the Schema
In the Supabase dashboard, go to **SQL Editor** and paste the contents of `supabase/schema.sql`. Run it to create the `events` table, indexes, triggers, and RLS policies.

### 3. (Optional) Load Sample Data
Paste and run `supabase/seed.sql` in the SQL Editor to populate the calendar with demo events for testing.

### 4. Row-Level Security (RLS)
RLS is enabled automatically by `schema.sql`. Key policies:
- **Anonymous users** (`anon` key) can only `SELECT` events where `status = 'published'`
- **Authenticated users** can read all events
- **Service role key** bypasses RLS entirely — used by the admin API routes for all writes

For more on RLS: [Supabase RLS docs](https://supabase.com/docs/guides/database/postgres/row-level-security)

### 5. Create the First Admin User
1. Go to Supabase dashboard → **Authentication** → **Users**
2. Click **Invite user** (or **Add user**)
3. Enter the admin email address and set a password
4. The user can now log in at `/admin/login`

> **Note:** For MVP, a single admin user is sufficient. No role management is needed.

---

## Deploying to Vercel

### 1. Push to GitHub
```bash
git add .
git commit -m "Initial CWTH calendar build"
git push origin main
```

### 2. Connect to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **Add New → Project**
3. Import your GitHub repository
4. Vercel auto-detects Next.js — no build configuration needed

### 3. Add Environment Variables
Go to **Vercel Dashboard → Project → Settings → Environment Variables** and add all variables from the table above.

- Set `NEXT_PUBLIC_*` variables for **All** environments
- Set `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `DIGEST_RECIPIENT_EMAIL`, `ADMIN_EMAIL` for **Production + Preview** only
- Set `NEXT_PUBLIC_CALENDAR_URL` to your production domain

> **Important:** After adding environment variables, trigger a new deployment: **Deployments → Redeploy**

### 4. Deploy
Click **Deploy**. Vercel builds and deploys automatically on every push to `main`.

### 5. Custom Domain (Optional)
Go to **Project → Settings → Domains** and add your custom domain.

---

## Sending the Weekly Digest

Step-by-step for non-technical users:

1. Log in to the admin panel at `https://your-domain.com/admin`
2. Click **Send Digest** in the top navigation
3. Click **Preview Digest** — this shows you the email that will be sent, listing all events in the next 7 days
4. Review the preview. If events are missing, check they are set to **Published** status in the Events section
5. Confirm or change the recipient email address in the **Send Digest Email** section
6. Click **Send Digest**
7. A confirmation message will appear when the email has been sent successfully

---

## Managing Events (Admin Panel)

1. Log in at `/admin/login` with your admin email and password
2. The **Events** page shows all events (including drafts and cancelled)
3. Click **+ New Event** to create an event
4. Click **Edit** on any event row to modify it
5. Use the **Status** field to control visibility:
   - **Published** — visible on the public calendar immediately
   - **Draft** — saved but hidden from public view
   - **Cancelled** — shows on public calendar with a red "Cancelled" banner
6. Use **Duplicate** to copy an event (creates a draft copy)
7. Use **Delete** to permanently remove an event (confirmation required)

---

## Troubleshooting: Common Vercel Issues

**Events not showing after deploy**
- Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set in Vercel dashboard
- Trigger a redeploy after adding env vars

**Admin login redirects back to login page**
- Confirm `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
- Check that `middleware.ts` is at the project root (not inside `/app` or `/src`)
- Test in incognito — `/admin` should redirect to `/admin/login` when not authenticated

**Digest email fails to send**
- Verify `RESEND_API_KEY` is set and active in the Vercel dashboard
- Check Vercel function logs: **Dashboard → Deployments → Functions**
- Ensure the function completes within 10 seconds (Vercel Hobby plan timeout)
- Confirm your Resend account has a verified sending domain

**`SUPABASE_SERVICE_ROLE_KEY` not working**
- Never prefix this with `NEXT_PUBLIC_` — it must remain server-side only
- Set it in Vercel for Production and Preview environments only

**Build fails with TypeScript errors**
- Run `npm run build` locally first to catch errors before pushing
- Check `next-env.d.ts` is not gitignored (it is generated by Next.js)

**`middleware.ts` not protecting /admin routes**
- The file must be at the project root, not inside `/app/`
- Check the `matcher` config: it should include `/admin/:path*`

---

## Known Limitations (MVP — v1)

The following features are out of scope for the initial release and noted as future enhancements:

- **Self-service event submission** — teams cannot submit their own events; admin submits on their behalf
- **iCal / Google Calendar sync** — no calendar export in v1
- **Recurring events** — each event must be created individually
- **Attendee registration or waitlists** — booking is handled externally via booking URL
- **Automated digest scheduling** — digest must be sent manually from the admin panel
- **Public comments or ratings** — events are read-only for public users
- **Multi-organisation support** — single CWTH instance only

---

## Project Structure

```
/
├── app/                    # Next.js App Router pages & API routes
│   ├── page.tsx            # Public calendar
│   ├── admin/              # Admin panel (auth-protected)
│   └── api/                # Serverless API routes (Vercel Functions)
├── components/
│   ├── calendar/           # WeeklyView, ListView, EventCard, EventModal, FilterBar
│   ├── admin/              # EventTable, EventForm, DigestPanel
│   └── shared/             # Header, Badge, Toast
├── lib/
│   ├── supabase/           # Browser + server Supabase clients
│   ├── email/              # Resend client + HTML digest builder
│   ├── types.ts            # Shared TypeScript types
│   └── utils.ts            # Date/time formatting utilities
├── public/
│   └── cwth-logo.svg
├── supabase/
│   ├── schema.sql          # Run in Supabase SQL Editor
│   └── seed.sql            # Demo data
└── middleware.ts            # Auth protection for /admin routes
```

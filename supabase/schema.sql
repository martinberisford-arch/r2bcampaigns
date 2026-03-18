-- CWTH Events & Training Calendar — Supabase Schema
-- Run this entire file in the Supabase SQL Editor to set up the database.

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- EVENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.events (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT        NOT NULL,
  description     TEXT,
  event_date      DATE        NOT NULL,
  start_time      TIME,
  end_time        TIME,
  location        TEXT,
  delivery_mode   TEXT        CHECK (delivery_mode IN ('In Person', 'Online', 'Hybrid')),
  category        TEXT        NOT NULL,
  target_audience TEXT,
  booking_url     TEXT,
  organiser_team  TEXT,
  organiser_name  TEXT,
  organiser_email TEXT,
  status          TEXT        NOT NULL DEFAULT 'published'
                              CHECK (status IN ('published', 'draft', 'cancelled')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_events_date_status
  ON public.events (event_date, status);

CREATE INDEX IF NOT EXISTS idx_events_category
  ON public.events (category);

CREATE INDEX IF NOT EXISTS idx_events_status
  ON public.events (status);

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_events_updated_at ON public.events;
CREATE TRIGGER set_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Public (anonymous) users can SELECT published events only
CREATE POLICY "events_public_read"
  ON public.events
  FOR SELECT
  TO anon
  USING (status = 'published');

-- Authenticated users (admins) can read all events
CREATE POLICY "events_admin_read"
  ON public.events
  FOR SELECT
  TO authenticated
  USING (true);

-- Service role key bypasses RLS automatically — these policies
-- allow authenticated session users to also write (as a fallback).
CREATE POLICY "events_admin_insert"
  ON public.events
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "events_admin_update"
  ON public.events
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "events_admin_delete"
  ON public.events
  FOR DELETE
  TO authenticated
  USING (true);

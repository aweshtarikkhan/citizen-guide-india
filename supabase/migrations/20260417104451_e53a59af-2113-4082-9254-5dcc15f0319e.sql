
-- Live results per candidate per constituency
CREATE TABLE public.live_results (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  state_slug text NOT NULL,
  constituency text NOT NULL,
  candidate_name text NOT NULL,
  party text,
  alliance text,
  votes bigint NOT NULL DEFAULT 0,
  is_leading boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'counting', -- counting | won | lost
  round_number integer,
  total_rounds integer,
  fetched_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (state_slug, constituency, candidate_name)
);

CREATE INDEX idx_live_results_state ON public.live_results(state_slug);
CREATE INDEX idx_live_results_constituency ON public.live_results(state_slug, constituency);

ALTER TABLE public.live_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read live results"
  ON public.live_results FOR SELECT
  USING (true);

CREATE POLICY "Service role manages live results"
  ON public.live_results FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);

-- Realtime
ALTER TABLE public.live_results REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_results;

-- Global status row
CREATE TABLE public.live_status (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  is_active boolean NOT NULL DEFAULT false,
  last_run_at timestamptz,
  last_success_at timestamptz,
  last_error text,
  states_active text[] DEFAULT '{}',
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.live_status (is_active) VALUES (false);

ALTER TABLE public.live_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read live status"
  ON public.live_status FOR SELECT
  USING (true);

CREATE POLICY "Service role manages live status"
  ON public.live_status FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);

ALTER TABLE public.live_status REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_status;

-- Enable required extensions for cron
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

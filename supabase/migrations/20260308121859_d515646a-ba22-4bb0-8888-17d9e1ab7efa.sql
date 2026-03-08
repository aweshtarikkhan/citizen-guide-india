
CREATE TABLE public.candidate_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id TEXT NOT NULL,
  constituency TEXT NOT NULL,
  candidate_name TEXT NOT NULL,
  party TEXT,
  criminal_cases INTEGER DEFAULT 0,
  education TEXT,
  total_assets TEXT,
  liabilities TEXT,
  age INTEGER,
  self_profession TEXT,
  spouse_profession TEXT,
  pan_status TEXT,
  income_details JSONB,
  criminal_details JSONB,
  movable_assets JSONB,
  immovable_assets JSONB,
  source_of_income JSONB,
  raw_markdown TEXT,
  scraped_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  detail_scraped BOOLEAN DEFAULT false,
  myneta_url TEXT,
  UNIQUE(candidate_id)
);

ALTER TABLE public.candidate_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON public.candidate_cache
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow service role insert/update" ON public.candidate_cache
  FOR ALL TO service_role USING (true) WITH CHECK (true);

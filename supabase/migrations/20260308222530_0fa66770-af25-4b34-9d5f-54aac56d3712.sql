
CREATE TABLE public.translation_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_text_hash text NOT NULL,
  source_lang text NOT NULL DEFAULT 'en',
  target_lang text NOT NULL,
  translated_text text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_translation_cache_lookup ON public.translation_cache (source_text_hash, target_lang);

ALTER TABLE public.translation_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read translations" ON public.translation_cache
  FOR SELECT USING (true);

CREATE POLICY "Service role can insert translations" ON public.translation_cache
  FOR INSERT WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.set_updated_at_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TABLE public.exit_polls (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  state_slug TEXT NOT NULL,
  state_name TEXT NOT NULL,
  agency TEXT NOT NULL,
  poll_date DATE,
  methodology TEXT,
  sample_size TEXT,
  predictions JSONB NOT NULL DEFAULT '[]'::jsonb,
  summary TEXT,
  source_url TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID
);

CREATE INDEX idx_exit_polls_state_slug ON public.exit_polls(state_slug);
CREATE INDEX idx_exit_polls_featured ON public.exit_polls(is_featured) WHERE is_featured = true;

ALTER TABLE public.exit_polls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read exit polls"
  ON public.exit_polls FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage exit polls"
  ON public.exit_polls FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER set_exit_polls_updated_at
  BEFORE UPDATE ON public.exit_polls
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at_timestamp();

-- Table for admin overrides of constituency MP/party data
CREATE TABLE public.constituency_overrides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  constituency_name text NOT NULL,
  state_id text NOT NULL,
  mp_name text,
  party text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid,
  UNIQUE(constituency_name, state_id)
);

ALTER TABLE public.constituency_overrides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage constituency overrides"
  ON public.constituency_overrides
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can read constituency overrides"
  ON public.constituency_overrides
  FOR SELECT
  TO public
  USING (true);

-- Table for site-wide settings (map type etc)
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text NOT NULL UNIQUE,
  setting_value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage site settings"
  ON public.site_settings
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can read site settings"
  ON public.site_settings
  FOR SELECT
  TO public
  USING (true);

-- Insert default map type setting
INSERT INTO public.site_settings (setting_key, setting_value)
VALUES ('constituency_map_type', '"leaflet"'::jsonb);

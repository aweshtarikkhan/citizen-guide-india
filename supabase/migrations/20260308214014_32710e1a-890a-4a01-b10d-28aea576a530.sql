
CREATE TABLE public.page_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug text NOT NULL,
  section_key text NOT NULL,
  section_label text NOT NULL DEFAULT '',
  content_type text NOT NULL DEFAULT 'text',
  content text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id),
  UNIQUE(page_slug, section_key)
);

ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;

-- Anyone can read page content (public website)
CREATE POLICY "Anyone can read page content"
ON public.page_content FOR SELECT
USING (true);

-- Admins can manage page content
CREATE POLICY "Admins can manage page content"
ON public.page_content FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

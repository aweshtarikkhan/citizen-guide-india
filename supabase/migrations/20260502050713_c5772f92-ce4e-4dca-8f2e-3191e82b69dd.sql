
ALTER TABLE public.blogs
  ADD COLUMN IF NOT EXISTS slug text,
  ADD COLUMN IF NOT EXISTS seo_title text,
  ADD COLUMN IF NOT EXISTS seo_description text,
  ADD COLUMN IF NOT EXISTS seo_keywords text;

CREATE UNIQUE INDEX IF NOT EXISTS blogs_slug_unique_idx ON public.blogs(slug) WHERE slug IS NOT NULL;

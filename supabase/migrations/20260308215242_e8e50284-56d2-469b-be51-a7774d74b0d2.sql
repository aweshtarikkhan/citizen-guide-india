
-- Fix: All page_content and blogs RLS policies are RESTRICTIVE which blocks all access.
-- Drop restrictive policies and recreate as PERMISSIVE.

-- page_content: fix read policy
DROP POLICY IF EXISTS "Anyone can read page content" ON public.page_content;
DROP POLICY IF EXISTS "Admins can manage page content" ON public.page_content;

CREATE POLICY "Anyone can read page content" ON public.page_content
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage page content" ON public.page_content
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- blogs: fix policies
DROP POLICY IF EXISTS "Public read published blogs" ON public.blogs;
DROP POLICY IF EXISTS "Admins full access blogs" ON public.blogs;
DROP POLICY IF EXISTS "Editors can view own blogs" ON public.blogs;
DROP POLICY IF EXISTS "Editors can insert own blogs" ON public.blogs;
DROP POLICY IF EXISTS "Editors can update own blogs" ON public.blogs;
DROP POLICY IF EXISTS "Editors can delete own blogs" ON public.blogs;

CREATE POLICY "Public read published blogs" ON public.blogs
  FOR SELECT USING (status = 'published');

CREATE POLICY "Admins full access blogs" ON public.blogs
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Editors can view own blogs" ON public.blogs
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'editor') AND author_id = auth.uid());

CREATE POLICY "Editors can insert own blogs" ON public.blogs
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'editor') AND author_id = auth.uid());

CREATE POLICY "Editors can update own blogs" ON public.blogs
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'editor') AND author_id = auth.uid())
  WITH CHECK (public.has_role(auth.uid(), 'editor') AND author_id = auth.uid());

CREATE POLICY "Editors can delete own blogs" ON public.blogs
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'editor') AND author_id = auth.uid());

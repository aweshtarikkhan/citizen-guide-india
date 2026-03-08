
-- Drop old blog policies
DROP POLICY IF EXISTS "Admins can manage blogs" ON public.blogs;
DROP POLICY IF EXISTS "Anyone can read published blogs" ON public.blogs;

-- Admins full access on blogs
CREATE POLICY "Admins full access blogs"
ON public.blogs FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Editors can insert their own blogs
CREATE POLICY "Editors can insert own blogs"
ON public.blogs FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'editor') AND author_id = auth.uid());

-- Editors can view only their own blogs
CREATE POLICY "Editors can view own blogs"
ON public.blogs FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'editor') AND author_id = auth.uid());

-- Editors can update only their own blogs
CREATE POLICY "Editors can update own blogs"
ON public.blogs FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'editor') AND author_id = auth.uid())
WITH CHECK (public.has_role(auth.uid(), 'editor') AND author_id = auth.uid());

-- Editors can delete only their own blogs
CREATE POLICY "Editors can delete own blogs"
ON public.blogs FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'editor') AND author_id = auth.uid());

-- Public can read published blogs
CREATE POLICY "Public read published blogs"
ON public.blogs FOR SELECT
USING (status = 'published');

-- Allow admins to manage user_roles
CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

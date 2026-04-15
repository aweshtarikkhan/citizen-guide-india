
-- Drop existing profile read policies and recreate with super admin hidden
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON public.profiles;

-- Users can read own profile (including super admin reading their own)
CREATE POLICY "Users can read own profile"
ON public.profiles FOR SELECT TO authenticated
USING (auth.uid() = id);

-- Admins can read all profiles EXCEPT super admin's profile
CREATE POLICY "Admins can read non-super profiles"
ON public.profiles FOR SELECT TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') 
  AND NOT public.is_super_admin(id)
  AND NOT public.is_super_admin(auth.uid())
);

-- Super admin can read ALL profiles
CREATE POLICY "Super admin can read all profiles"
ON public.profiles FOR SELECT TO authenticated
USING (public.is_super_admin(auth.uid()));

-- Vice super admin can read all except super admin
CREATE POLICY "Vice super admin can read profiles"
ON public.profiles FOR SELECT TO authenticated
USING (
  public.has_role(auth.uid(), 'vice_super_admin')
  AND NOT public.is_super_admin(id)
);

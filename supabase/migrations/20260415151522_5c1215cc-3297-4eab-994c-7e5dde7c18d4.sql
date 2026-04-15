
-- Assign super_admin to the existing admin user
INSERT INTO public.user_roles (user_id, role)
VALUES ('ff541307-e298-4edd-8bbf-b1e6266a141a', 'super_admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Create helper functions
CREATE OR REPLACE FUNCTION public.is_super_or_vice(uid uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = uid AND role IN ('super_admin', 'vice_super_admin')
  )
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin(uid uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = uid AND role = 'super_admin'
  )
$$;

-- Create trigger to protect super_admin
CREATE OR REPLACE FUNCTION public.protect_super_admin_role()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'DELETE' AND OLD.role = 'super_admin' THEN
    RAISE EXCEPTION 'Super Admin role cannot be removed';
  END IF;
  IF TG_OP = 'UPDATE' AND OLD.role = 'super_admin' THEN
    RAISE EXCEPTION 'Super Admin role cannot be modified';
  END IF;
  IF TG_OP = 'DELETE' AND OLD.role = 'vice_super_admin' THEN
    IF NOT public.is_super_admin(auth.uid()) THEN
      RAISE EXCEPTION 'Only Super Admin can remove Vice Super Admin';
    END IF;
  END IF;
  IF TG_OP = 'INSERT' AND NEW.role = 'vice_super_admin' THEN
    IF NOT public.is_super_admin(auth.uid()) THEN
      RAISE EXCEPTION 'Only Super Admin can assign Vice Super Admin';
    END IF;
    IF EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'vice_super_admin') THEN
      RAISE EXCEPTION 'Only one Vice Super Admin is allowed';
    END IF;
  END IF;
  IF TG_OP = 'INSERT' AND NEW.role = 'super_admin' THEN
    RAISE EXCEPTION 'Super Admin role cannot be assigned';
  END IF;
  IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_super_admin ON public.user_roles;
CREATE TRIGGER protect_super_admin
  BEFORE INSERT OR UPDATE OR DELETE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.protect_super_admin_role();

-- Update RLS
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;

CREATE POLICY "Super admin can manage all roles"
ON public.user_roles FOR ALL TO authenticated
USING (public.is_super_admin(auth.uid()))
WITH CHECK (public.is_super_admin(auth.uid()));

CREATE POLICY "Vice super admin can manage roles"
ON public.user_roles FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'vice_super_admin'))
WITH CHECK (public.has_role(auth.uid(), 'vice_super_admin'));

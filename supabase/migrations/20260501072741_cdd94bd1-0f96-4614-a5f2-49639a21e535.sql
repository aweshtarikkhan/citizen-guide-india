-- Unified submissions table for newsletter, feedback, help desk tickets, and chat leads
CREATE TABLE public.submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('newsletter', 'feedback', 'help_desk', 'chat_lead')),
  name TEXT,
  email TEXT,
  mobile TEXT,
  -- feedback
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  page_path TEXT,
  page_title TEXT,
  message TEXT,
  -- help desk
  subject TEXT,
  category TEXT,
  constituency TEXT,
  state TEXT,
  -- meta
  status TEXT NOT NULL DEFAULT 'new',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_submissions_type ON public.submissions(type);
CREATE INDEX idx_submissions_created_at ON public.submissions(created_at DESC);
CREATE INDEX idx_submissions_status ON public.submissions(status);

ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Anyone can insert submissions (public forms)
CREATE POLICY "Anyone can submit"
ON public.submissions FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only admins can read/manage
CREATE POLICY "Admins can read submissions"
ON public.submissions FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update submissions"
ON public.submissions FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete submissions"
ON public.submissions FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Updated_at trigger
CREATE TRIGGER set_submissions_updated_at
BEFORE UPDATE ON public.submissions
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_timestamp();
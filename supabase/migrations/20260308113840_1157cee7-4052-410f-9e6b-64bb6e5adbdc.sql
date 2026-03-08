-- Create storage bucket for resumes
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('resumes', 'resumes', false, 5242880);

-- Create volunteer applications table
CREATE TABLE public.volunteer_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  skills TEXT[] DEFAULT '{}',
  experience TEXT,
  availability TEXT NOT NULL,
  why_join_us TEXT NOT NULL,
  resume_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.volunteer_applications ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public application form)
CREATE POLICY "Anyone can submit application" ON public.volunteer_applications
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Storage policies for resume bucket
CREATE POLICY "Anyone can upload resumes" ON storage.objects
  FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'resumes');

CREATE POLICY "Anyone can view resumes" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'resumes');
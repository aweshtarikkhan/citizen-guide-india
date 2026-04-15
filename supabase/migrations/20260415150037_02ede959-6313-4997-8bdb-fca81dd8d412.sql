
CREATE TABLE public.reading_history (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  blog_id uuid NOT NULL REFERENCES public.blogs(id) ON DELETE CASCADE,
  last_read_at timestamp with time zone NOT NULL DEFAULT now(),
  read_progress integer NOT NULL DEFAULT 0,
  reading_time_seconds integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, blog_id)
);

ALTER TABLE public.reading_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own reading history"
ON public.reading_history FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reading history"
ON public.reading_history FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reading history"
ON public.reading_history FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reading history"
ON public.reading_history FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE INDEX idx_reading_history_user ON public.reading_history(user_id);
CREATE INDEX idx_reading_history_last_read ON public.reading_history(user_id, last_read_at DESC);

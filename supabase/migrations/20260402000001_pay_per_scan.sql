-- Add scan_credits column for pay-per-scan
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS scan_credits INTEGER DEFAULT 0;

-- Zero out all free users (no free scans)
UPDATE public.profiles
SET scan_credits = 0
WHERE plan = 'free';

-- Update the signup trigger so new users start with 0 credits
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, scan_credits)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    0
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

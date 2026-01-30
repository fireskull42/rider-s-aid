-- Add access token and physical attributes to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS access_token TEXT UNIQUE DEFAULT encode(gen_random_bytes(8), 'hex'),
ADD COLUMN IF NOT EXISTS gender TEXT,
ADD COLUMN IF NOT EXISTS weight_kg NUMERIC(5,1),
ADD COLUMN IF NOT EXISTS height_cm INTEGER;

-- Create index for fast token lookups
CREATE INDEX IF NOT EXISTS idx_profiles_access_token ON public.profiles(access_token);

-- Function to regenerate access token
CREATE OR REPLACE FUNCTION public.regenerate_access_token(profile_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_token TEXT;
BEGIN
  -- Only allow users to regenerate their own token
  IF auth.uid() != profile_id THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  
  new_token := encode(gen_random_bytes(8), 'hex');
  
  UPDATE public.profiles 
  SET access_token = new_token 
  WHERE id = profile_id;
  
  RETURN new_token;
END;
$$;
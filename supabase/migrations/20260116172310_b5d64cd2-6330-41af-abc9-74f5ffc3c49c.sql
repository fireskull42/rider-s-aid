-- Create profiles table for user medical data
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  birth_date DATE,
  blood_type TEXT CHECK (blood_type IN ('A', 'B', 'AB', '0', NULL)),
  rh_factor TEXT CHECK (rh_factor IN ('+', '-', NULL)),
  is_organ_donor BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create allergies table
CREATE TABLE public.allergies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'other',
  name TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'moderate' CHECK (severity IN ('mild', 'moderate', 'severe')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create medications table
CREATE TABLE public.medications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  dosage TEXT NOT NULL DEFAULT '',
  frequency TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create conditions table (chronic conditions/diagnoses)
CREATE TABLE public.conditions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create implants table
CREATE TABLE public.implants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create emergency_contacts table
CREATE TABLE public.emergency_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  relationship TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.allergies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.implants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;

-- PUBLIC SELECT policies (for emergency responders - no login required)
CREATE POLICY "Public can view all profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Public can view all allergies"
  ON public.allergies FOR SELECT
  USING (true);

CREATE POLICY "Public can view all medications"
  ON public.medications FOR SELECT
  USING (true);

CREATE POLICY "Public can view all conditions"
  ON public.conditions FOR SELECT
  USING (true);

CREATE POLICY "Public can view all implants"
  ON public.implants FOR SELECT
  USING (true);

CREATE POLICY "Public can view all emergency_contacts"
  ON public.emergency_contacts FOR SELECT
  USING (true);

-- INSERT policies (authenticated users only, for their own data)
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own allergies"
  ON public.allergies FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can insert their own medications"
  ON public.medications FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can insert their own conditions"
  ON public.conditions FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can insert their own implants"
  ON public.implants FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can insert their own emergency_contacts"
  ON public.emergency_contacts FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

-- UPDATE policies (authenticated users only, for their own data)
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own allergies"
  ON public.allergies FOR UPDATE
  USING (auth.uid() = profile_id);

CREATE POLICY "Users can update their own medications"
  ON public.medications FOR UPDATE
  USING (auth.uid() = profile_id);

CREATE POLICY "Users can update their own conditions"
  ON public.conditions FOR UPDATE
  USING (auth.uid() = profile_id);

CREATE POLICY "Users can update their own implants"
  ON public.implants FOR UPDATE
  USING (auth.uid() = profile_id);

CREATE POLICY "Users can update their own emergency_contacts"
  ON public.emergency_contacts FOR UPDATE
  USING (auth.uid() = profile_id);

-- DELETE policies (authenticated users only, for their own data)
CREATE POLICY "Users can delete their own allergies"
  ON public.allergies FOR DELETE
  USING (auth.uid() = profile_id);

CREATE POLICY "Users can delete their own medications"
  ON public.medications FOR DELETE
  USING (auth.uid() = profile_id);

CREATE POLICY "Users can delete their own conditions"
  ON public.conditions FOR DELETE
  USING (auth.uid() = profile_id);

CREATE POLICY "Users can delete their own implants"
  ON public.implants FOR DELETE
  USING (auth.uid() = profile_id);

CREATE POLICY "Users can delete their own emergency_contacts"
  ON public.emergency_contacts FOR DELETE
  USING (auth.uid() = profile_id);

-- Create trigger function for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for profiles table
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''));
  RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
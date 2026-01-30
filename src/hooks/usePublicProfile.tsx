import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PublicProfile {
  id: string;
  full_name: string;
  birth_date: string | null;
  blood_type: string | null;
  rh_factor: string | null;
  is_organ_donor: boolean;
  updated_at: string;
  gender: string | null;
  weight_kg: number | null;
  height_cm: number | null;
}

export interface PublicAllergy {
  id: string;
  type: string;
  name: string;
  severity: string;
}

export interface PublicMedication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
}

export interface PublicCondition {
  id: string;
  name: string;
}

export interface PublicImplant {
  id: string;
  name: string;
  year: number | null;
}

export interface PublicEmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
}

export function usePublicProfileByToken(token?: string) {
  return useQuery({
    queryKey: ['public-profile', token],
    queryFn: async () => {
      if (!token) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, birth_date, blood_type, rh_factor, is_organ_donor, updated_at, gender, weight_kg, height_cm')
        .eq('access_token', token)
        .maybeSingle();
      if (error) throw error;
      return data as PublicProfile | null;
    },
    enabled: !!token,
  });
}

export function usePublicAllergies(profileId?: string) {
  return useQuery({
    queryKey: ['public-allergies', profileId],
    queryFn: async () => {
      if (!profileId) return [];
      const { data, error } = await supabase
        .from('allergies')
        .select('id, type, name, severity')
        .eq('profile_id', profileId);
      if (error) throw error;
      return data as PublicAllergy[];
    },
    enabled: !!profileId,
  });
}

export function usePublicMedications(profileId?: string) {
  return useQuery({
    queryKey: ['public-medications', profileId],
    queryFn: async () => {
      if (!profileId) return [];
      const { data, error } = await supabase
        .from('medications')
        .select('id, name, dosage, frequency')
        .eq('profile_id', profileId);
      if (error) throw error;
      return data as PublicMedication[];
    },
    enabled: !!profileId,
  });
}

export function usePublicConditions(profileId?: string) {
  return useQuery({
    queryKey: ['public-conditions', profileId],
    queryFn: async () => {
      if (!profileId) return [];
      const { data, error } = await supabase
        .from('conditions')
        .select('id, name')
        .eq('profile_id', profileId);
      if (error) throw error;
      return data as PublicCondition[];
    },
    enabled: !!profileId,
  });
}

export function usePublicImplants(profileId?: string) {
  return useQuery({
    queryKey: ['public-implants', profileId],
    queryFn: async () => {
      if (!profileId) return [];
      const { data, error } = await supabase
        .from('implants')
        .select('id, name, year')
        .eq('profile_id', profileId);
      if (error) throw error;
      return data as PublicImplant[];
    },
    enabled: !!profileId,
  });
}

export function usePublicEmergencyContacts(profileId?: string) {
  return useQuery({
    queryKey: ['public-emergency-contacts', profileId],
    queryFn: async () => {
      if (!profileId) return [];
      const { data, error } = await supabase
        .from('emergency_contacts')
        .select('id, name, relationship, phone')
        .eq('profile_id', profileId);
      if (error) throw error;
      return data as PublicEmergencyContact[];
    },
    enabled: !!profileId,
  });
}

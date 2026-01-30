import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Profile {
  id: string;
  full_name: string;
  birth_date: string | null;
  blood_type: string | null;
  rh_factor: string | null;
  is_organ_donor: boolean;
  updated_at: string;
  access_token: string | null;
  gender: string | null;
  weight_kg: number | null;
  height_cm: number | null;
}

export interface Allergy {
  id: string;
  profile_id: string;
  type: string;
  name: string;
  severity: string;
}

export interface Medication {
  id: string;
  profile_id: string;
  name: string;
  dosage: string;
  frequency: string;
}

export interface Condition {
  id: string;
  profile_id: string;
  name: string;
}

export interface Implant {
  id: string;
  profile_id: string;
  name: string;
  year: number | null;
}

export interface EmergencyContact {
  id: string;
  profile_id: string;
  name: string;
  relationship: string;
  phone: string;
}

export function useProfile(profileId?: string) {
  const { user } = useAuth();
  const id = profileId || user?.id;

  return useQuery({
    queryKey: ['profile', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error) throw error;
      return data as Profile | null;
    },
    enabled: !!id,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (updates: Partial<Profile>) => {
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

export function useAllergies(profileId?: string) {
  const { user } = useAuth();
  const id = profileId || user?.id;

  return useQuery({
    queryKey: ['allergies', id],
    queryFn: async () => {
      if (!id) return [];
      const { data, error } = await supabase
        .from('allergies')
        .select('*')
        .eq('profile_id', id);
      if (error) throw error;
      return data as Allergy[];
    },
    enabled: !!id,
  });
}

export function useAddAllergy() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (allergy: Omit<Allergy, 'id' | 'profile_id'>) => {
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase
        .from('allergies')
        .insert({ ...allergy, profile_id: user.id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allergies'] });
    },
  });
}

export function useDeleteAllergy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('allergies').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allergies'] });
    },
  });
}

export function useMedications(profileId?: string) {
  const { user } = useAuth();
  const id = profileId || user?.id;

  return useQuery({
    queryKey: ['medications', id],
    queryFn: async () => {
      if (!id) return [];
      const { data, error } = await supabase
        .from('medications')
        .select('*')
        .eq('profile_id', id);
      if (error) throw error;
      return data as Medication[];
    },
    enabled: !!id,
  });
}

export function useAddMedication() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (medication: Omit<Medication, 'id' | 'profile_id'>) => {
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase
        .from('medications')
        .insert({ ...medication, profile_id: user.id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] });
    },
  });
}

export function useDeleteMedication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('medications').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] });
    },
  });
}

export function useConditions(profileId?: string) {
  const { user } = useAuth();
  const id = profileId || user?.id;

  return useQuery({
    queryKey: ['conditions', id],
    queryFn: async () => {
      if (!id) return [];
      const { data, error } = await supabase
        .from('conditions')
        .select('*')
        .eq('profile_id', id);
      if (error) throw error;
      return data as Condition[];
    },
    enabled: !!id,
  });
}

export function useAddCondition() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (condition: Omit<Condition, 'id' | 'profile_id'>) => {
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase
        .from('conditions')
        .insert({ ...condition, profile_id: user.id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conditions'] });
    },
  });
}

export function useDeleteCondition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('conditions').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conditions'] });
    },
  });
}

export function useImplants(profileId?: string) {
  const { user } = useAuth();
  const id = profileId || user?.id;

  return useQuery({
    queryKey: ['implants', id],
    queryFn: async () => {
      if (!id) return [];
      const { data, error } = await supabase
        .from('implants')
        .select('*')
        .eq('profile_id', id);
      if (error) throw error;
      return data as Implant[];
    },
    enabled: !!id,
  });
}

export function useAddImplant() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (implant: Omit<Implant, 'id' | 'profile_id'>) => {
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase
        .from('implants')
        .insert({ ...implant, profile_id: user.id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['implants'] });
    },
  });
}

export function useDeleteImplant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('implants').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['implants'] });
    },
  });
}

export function useEmergencyContacts(profileId?: string) {
  const { user } = useAuth();
  const id = profileId || user?.id;

  return useQuery({
    queryKey: ['emergency_contacts', id],
    queryFn: async () => {
      if (!id) return [];
      const { data, error } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('profile_id', id);
      if (error) throw error;
      return data as EmergencyContact[];
    },
    enabled: !!id,
  });
}

export function useAddEmergencyContact() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (contact: Omit<EmergencyContact, 'id' | 'profile_id'>) => {
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase
        .from('emergency_contacts')
        .insert({ ...contact, profile_id: user.id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergency_contacts'] });
    },
  });
}

export function useDeleteEmergencyContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('emergency_contacts').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergency_contacts'] });
    },
  });
}

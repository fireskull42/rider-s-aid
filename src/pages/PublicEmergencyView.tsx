import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usePublicProfileByToken, usePublicAllergies, usePublicMedications, usePublicConditions, usePublicImplants, usePublicEmergencyContacts } from '@/hooks/usePublicProfile';
import { EmergencyHeader } from '@/components/EmergencyHeader';
import { PersonalInfoCard } from '@/components/PersonalInfoCard';
import { BloodTypeCard } from '@/components/BloodTypeCard';
import { AllergyCard } from '@/components/AllergyCard';
import { MedicationsCard } from '@/components/MedicationsCard';
import { ConditionsCard } from '@/components/ConditionsCard';
import { EmergencyContactsCard } from '@/components/EmergencyContactsCard';
import { OrganDonorBadge } from '@/components/OrganDonorBadge';
import { EmergencyFooter } from '@/components/EmergencyFooter';
import { PhysicalDataCard } from '@/components/PhysicalDataCard';
import { Language, detectLanguage } from '@/lib/translations';

export default function PublicEmergencyView() {
  const { token } = useParams<{ token: string }>();
  const [language, setLanguage] = useState<Language>(() => detectLanguage());

  const { data: profile, isLoading: profileLoading, error: profileError } = usePublicProfileByToken(token);
  const { data: allergies = [] } = usePublicAllergies(profile?.id);
  const { data: medications = [] } = usePublicMedications(profile?.id);
  const { data: conditions = [] } = usePublicConditions(profile?.id);
  const { data: implants = [] } = usePublicImplants(profile?.id);
  const { data: emergencyContacts = [] } = usePublicEmergencyContacts(profile?.id);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'de' ? 'en' : 'de');
  };

  useEffect(() => {
    document.title = language === 'de' 
      ? 'NOTFALL - Medizinische Informationen' 
      : 'EMERGENCY - Medical Information';
  }, [language]);

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (profileError || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-2">
            {language === 'de' ? 'Profil nicht gefunden' : 'Profile not found'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'de' 
              ? 'Dieses Notfall-Profil existiert nicht oder der Link ist ungültig.'
              : 'This emergency profile does not exist or the link is invalid.'}
          </p>
        </div>
      </div>
    );
  }

  // Transform data to match component interfaces
  const formattedAllergies = allergies.map(a => ({
    type: a.type,
    name: a.name,
    severity: a.severity,
  }));

  const formattedMedications = medications.map(m => ({
    name: m.name,
    dosage: m.dosage,
    frequency: m.frequency,
  }));

  const formattedConditions = conditions.map(c => c.name);

  const formattedImplants = implants.map(i => 
    i.year ? `${i.name} (${i.year})` : i.name
  );

  const formattedContacts = emergencyContacts.map(c => ({
    name: c.name,
    relationship: c.relationship,
    phone: c.phone,
  }));

  return (
    <div className="min-h-screen bg-background">
      <EmergencyHeader language={language} onToggleLanguage={toggleLanguage} />
      
      <main className="container py-6 space-y-4">
        {/* Personal Info */}
        <PersonalInfoCard
          name={profile.full_name || (language === 'de' ? 'Nicht angegeben' : 'Not specified')}
          birthDate={profile.birth_date || ''}
          language={language}
        />

        {/* Physical Data - Gender, Weight, Height */}
        <PhysicalDataCard
          gender={profile.gender}
          weightKg={profile.weight_kg}
          heightCm={profile.height_cm}
          language={language}
        />

        {/* Critical Info Row - Blood Type & Allergies FIRST for emergency responders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <BloodTypeCard
            bloodType={profile.blood_type || ''}
            rhFactor={profile.rh_factor || ''}
            language={language}
          />
          <AllergyCard
            allergies={formattedAllergies}
            language={language}
          />
        </div>

        {/* Medical Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <MedicationsCard
            medications={formattedMedications}
            language={language}
          />
          <ConditionsCard
            conditions={formattedConditions}
            implants={formattedImplants}
            language={language}
          />
        </div>

        {/* Emergency Contacts */}
        <EmergencyContactsCard
          contacts={formattedContacts}
          language={language}
        />

        {/* Organ Donor Status */}
        <OrganDonorBadge
          isOrganDonor={profile.is_organ_donor}
          language={language}
        />
      </main>

      <EmergencyFooter
        lastUpdated={profile.updated_at}
        language={language}
      />
    </div>
  );
}

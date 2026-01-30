import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmergencyHeader } from '@/components/EmergencyHeader';
import { PersonalInfoCard } from '@/components/PersonalInfoCard';
import { BloodTypeCard } from '@/components/BloodTypeCard';
import { AllergyCard } from '@/components/AllergyCard';
import { MedicationsCard } from '@/components/MedicationsCard';
import { ConditionsCard } from '@/components/ConditionsCard';
import { EmergencyContactsCard } from '@/components/EmergencyContactsCard';
import { OrganDonorBadge } from '@/components/OrganDonorBadge';
import { EmergencyFooter } from '@/components/EmergencyFooter';
import { Language, detectLanguage } from '@/lib/translations';
import { demoMedicalData } from '@/lib/demoData';
import { useAuth } from '@/hooks/useAuth';
import { useProfile, useAllergies, useMedications, useConditions, useImplants, useEmergencyContacts } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { LogIn, Settings } from 'lucide-react';

export default function EmergencyView() {
  const [language, setLanguage] = useState<Language>(() => detectLanguage());
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  
  // Fetch user data if logged in
  const { data: profile } = useProfile();
  const { data: allergies } = useAllergies();
  const { data: medications } = useMedications();
  const { data: conditions } = useConditions();
  const { data: implants } = useImplants();
  const { data: emergencyContacts } = useEmergencyContacts();

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'de' ? 'en' : 'de');
  };

  // Set document title
  useEffect(() => {
    document.title = language === 'de' 
      ? 'NOTFALL - Medizinische Informationen' 
      : 'EMERGENCY - Medical Information';
  }, [language]);

  // Use real data if logged in, otherwise demo data
  const isLoggedIn = !!user && !authLoading;
  
  const data = isLoggedIn && profile ? {
    personalInfo: {
      name: profile.full_name || '',
      birthDate: profile.birth_date || '',
    },
    bloodInfo: {
      bloodType: profile.blood_type || '',
      rhFactor: profile.rh_factor || '',
    },
    allergies: (allergies || []).map(a => ({
      type: a.type as 'medication' | 'food' | 'environmental' | 'other',
      name: a.name,
      severity: a.severity as 'mild' | 'moderate' | 'severe',
    })),
    medications: (medications || []).map(m => ({
      name: m.name,
      dosage: m.dosage,
      frequency: m.frequency,
    })),
    conditions: (conditions || []).map(c => c.name),
    implants: (implants || []).map(i => i.name),
    emergencyContacts: (emergencyContacts || []).map(c => ({
      name: c.name,
      relationship: c.relationship,
      phone: c.phone,
    })),
    organDonor: profile.is_organ_donor || false,
    lastUpdated: profile.updated_at || new Date().toISOString(),
  } : demoMedicalData;

  return (
    <div className="min-h-screen bg-background">
      <EmergencyHeader language={language} onToggleLanguage={toggleLanguage} />
      
      <main className="container py-6 space-y-4">
        {/* Personal Info */}
        <PersonalInfoCard
          name={data.personalInfo.name}
          birthDate={data.personalInfo.birthDate}
          language={language}
        />

        {/* Critical Info Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <BloodTypeCard
            bloodType={data.bloodInfo.bloodType}
            rhFactor={data.bloodInfo.rhFactor}
            language={language}
          />
          <AllergyCard
            allergies={data.allergies}
            language={language}
          />
        </div>

        {/* Medical Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <MedicationsCard
            medications={data.medications}
            language={language}
          />
          <ConditionsCard
            conditions={data.conditions}
            implants={data.implants}
            language={language}
          />
        </div>

        {/* Emergency Contacts */}
        <EmergencyContactsCard
          contacts={data.emergencyContacts}
          language={language}
        />

        {/* Organ Donor Status */}
        <OrganDonorBadge
          isOrganDonor={data.organDonor}
          language={language}
        />
      </main>

      <EmergencyFooter
        lastUpdated={data.lastUpdated}
        language={language}
      />

      {/* Fixed Login/Dashboard Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {isLoggedIn ? (
          <Button
            size="lg"
            onClick={() => navigate('/dashboard')}
            className="shadow-lg flex items-center gap-2"
          >
            <Settings className="h-5 w-5" />
            {language === 'de' ? 'Daten bearbeiten' : 'Edit Data'}
          </Button>
        ) : (
          <Button
            size="lg"
            onClick={() => navigate('/auth')}
            className="shadow-lg flex items-center gap-2"
          >
            <LogIn className="h-5 w-5" />
            {language === 'de' ? 'Anmelden' : 'Login'}
          </Button>
        )}
      </div>
    </div>
  );
}

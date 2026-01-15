import { useState, useEffect } from 'react';
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

export default function EmergencyView() {
  const [language, setLanguage] = useState<Language>(() => detectLanguage());
  const data = demoMedicalData;

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'de' ? 'en' : 'de');
  };

  // Set document title
  useEffect(() => {
    document.title = language === 'de' 
      ? 'NOTFALL - Medizinische Informationen' 
      : 'EMERGENCY - Medical Information';
  }, [language]);

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
    </div>
  );
}

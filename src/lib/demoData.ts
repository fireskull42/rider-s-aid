export const demoMedicalData = {
  personalInfo: {
    name: 'Max Mustermann',
    birthDate: '1985-03-15',
    photoUrl: null,
  },
  bloodInfo: {
    bloodType: 'A',
    rhFactor: '+',
  },
  allergies: [
    { type: 'medication', name: 'Penicillin', severity: 'severe' },
    { type: 'food', name: 'Erdnüsse / Peanuts', severity: 'moderate' },
  ],
  medications: [
    { name: 'Metoprolol', dosage: '50mg', frequency: '1x täglich / daily' },
    { name: 'Aspirin', dosage: '100mg', frequency: '1x täglich / daily' },
  ],
  conditions: [
    'Hypertonie / Hypertension',
    'Diabetes Typ 2 / Type 2 Diabetes',
  ],
  implants: [
    'Herzschrittmacher / Pacemaker (2021)',
  ],
  emergencyContacts: [
    { name: 'Anna Mustermann', relationship: 'Ehefrau / Wife', phone: '+49 170 1234567' },
    { name: 'Dr. Klaus Schmidt', relationship: 'Hausarzt / Physician', phone: '+49 30 9876543' },
  ],
  physician: {
    name: 'Dr. med. Klaus Schmidt',
    clinic: 'Praxis am Markt, Berlin',
    phone: '+49 30 9876543',
  },
  organDonor: true,
  lastUpdated: '2024-01-10T14:30:00Z',
};

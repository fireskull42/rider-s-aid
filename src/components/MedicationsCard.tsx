import { Pill } from 'lucide-react';
import { Language, translations } from '@/lib/translations';

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
}

interface MedicationsCardProps {
  medications: Medication[];
  language: Language;
}

export function MedicationsCard({ medications, language }: MedicationsCardProps) {
  const t = translations[language];

  return (
    <div className="bg-card rounded-lg border-2 border-border p-5 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <Pill className="h-6 w-6 text-info" />
        <h3 className="text-emergency-base text-foreground">{t.medications}</h3>
      </div>
      
      {medications.length === 0 ? (
        <p className="text-muted-foreground text-lg">{t.none}</p>
      ) : (
        <ul className="space-y-3">
          {medications.map((med, index) => (
            <li key={index} className="border-b border-border last:border-0 pb-3 last:pb-0">
              <div className="font-semibold text-lg text-foreground">{med.name}</div>
              <div className="text-muted-foreground">
                {med.dosage} • {med.frequency}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

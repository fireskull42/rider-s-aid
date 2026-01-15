import { AlertCircle } from 'lucide-react';
import { Language, translations } from '@/lib/translations';

interface Allergy {
  type: string;
  name: string;
  severity: string;
}

interface AllergyCardProps {
  allergies: Allergy[];
  language: Language;
}

export function AllergyCard({ allergies, language }: AllergyCardProps) {
  const t = translations[language];

  return (
    <div className="section-allergy rounded-lg border-2 border-accent/30 p-5">
      <div className="flex items-center gap-3 mb-4">
        <AlertCircle className="h-6 w-6 text-accent" />
        <h3 className="text-emergency-base text-foreground">{t.allergies}</h3>
      </div>
      
      {allergies.length === 0 ? (
        <p className="text-muted-foreground text-lg">{t.none}</p>
      ) : (
        <ul className="space-y-3">
          {allergies.map((allergy, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className={`inline-block w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${
                allergy.severity === 'severe' ? 'bg-destructive' : 'bg-warning'
              }`} />
              <span className="text-lg font-medium text-foreground">{allergy.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

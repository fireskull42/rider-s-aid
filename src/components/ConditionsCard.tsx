import { Activity } from 'lucide-react';
import { Language, translations } from '@/lib/translations';

interface ConditionsCardProps {
  conditions: string[];
  implants: string[];
  language: Language;
}

export function ConditionsCard({ conditions, implants, language }: ConditionsCardProps) {
  const t = translations[language];

  return (
    <div className="section-medical rounded-lg border-2 border-info/30 p-5">
      <div className="flex items-center gap-3 mb-4">
        <Activity className="h-6 w-6 text-info" />
        <h3 className="text-emergency-base text-foreground">{t.conditions}</h3>
      </div>
      
      {conditions.length === 0 ? (
        <p className="text-muted-foreground text-lg">{t.none}</p>
      ) : (
        <ul className="space-y-2 mb-4">
          {conditions.map((condition, index) => (
            <li key={index} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-info flex-shrink-0" />
              <span className="text-lg text-foreground">{condition}</span>
            </li>
          ))}
        </ul>
      )}

      {implants.length > 0 && (
        <div className="mt-4 pt-4 border-t border-info/20">
          <h4 className="font-semibold text-foreground mb-2">{t.implants}</h4>
          <ul className="space-y-2">
            {implants.map((implant, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-warning flex-shrink-0" />
                <span className="text-lg text-foreground">{implant}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

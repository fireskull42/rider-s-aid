import { Droplets } from 'lucide-react';
import { Language, translations } from '@/lib/translations';

interface BloodTypeCardProps {
  bloodType: string;
  rhFactor: string;
  language: Language;
}

export function BloodTypeCard({ bloodType, rhFactor, language }: BloodTypeCardProps) {
  const t = translations[language];

  return (
    <div className="section-blood rounded-lg border-2 border-primary/30 p-5">
      <div className="flex items-center gap-3 mb-3">
        <Droplets className="h-6 w-6 text-primary" />
        <h3 className="text-emergency-base text-foreground">{t.bloodType}</h3>
      </div>
      
      <div className="flex items-center justify-center">
        <div className="text-center">
          <span className="text-5xl font-bold text-primary">
            {bloodType}{rhFactor}
          </span>
        </div>
      </div>
    </div>
  );
}

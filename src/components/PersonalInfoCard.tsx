import { User, Calendar } from 'lucide-react';
import { Language, translations } from '@/lib/translations';

interface PersonalInfoCardProps {
  name: string;
  birthDate: string;
  language: Language;
}

export function PersonalInfoCard({ name, birthDate, language }: PersonalInfoCardProps) {
  const t = translations[language];
  
  const formattedDate = new Date(birthDate).toLocaleDateString(
    language === 'de' ? 'de-DE' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  const age = Math.floor(
    (Date.now() - new Date(birthDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000)
  );

  return (
    <div className="bg-card rounded-lg border-2 border-border p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
          <User className="h-8 w-8 text-muted-foreground" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h2 className="text-emergency-lg text-foreground truncate">{name}</h2>
          <div className="flex items-center gap-2 mt-2 text-muted-foreground">
            <Calendar className="h-5 w-5 flex-shrink-0" />
            <span className="text-emergency-base">
              {formattedDate} ({age} {language === 'de' ? 'Jahre' : 'years'})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

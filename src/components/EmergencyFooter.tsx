import { Lock, Clock } from 'lucide-react';
import { Language, translations } from '@/lib/translations';

interface EmergencyFooterProps {
  lastUpdated: string;
  language: Language;
}

export function EmergencyFooter({ lastUpdated, language }: EmergencyFooterProps) {
  const t = translations[language];
  
  const formattedDate = new Date(lastUpdated).toLocaleDateString(
    language === 'de' ? 'de-DE' : 'en-US',
    { year: 'numeric', month: 'short', day: 'numeric' }
  );

  return (
    <footer className="mt-8 pb-8">
      <div className="container">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-5 bg-secondary rounded-lg">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className="text-sm">
              {t.lastUpdated}: {formattedDate}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <Lock className="h-4 w-4" />
            <span className="text-sm">{t.accessProtected}</span>
          </div>
        </div>
        
        <p className="text-center text-xs text-muted-foreground mt-4">
          MotoMedID • {language === 'de' ? 'Notfall-Medizinische Informationen' : 'Emergency Medical Information'}
        </p>
      </div>
    </footer>
  );
}

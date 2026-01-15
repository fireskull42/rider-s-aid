import { AlertTriangle, Phone } from 'lucide-react';
import { Language, translations } from '@/lib/translations';

interface EmergencyHeaderProps {
  language: Language;
  onToggleLanguage: () => void;
}

export function EmergencyHeader({ language, onToggleLanguage }: EmergencyHeaderProps) {
  const t = translations[language];

  return (
    <header className="emergency-banner text-primary-foreground sticky top-0 z-50">
      <div className="container py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 emergency-pulse" strokeWidth={2.5} />
            <h1 className="text-emergency-xl tracking-wide">{t.emergency}</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleLanguage}
              className="px-3 py-1.5 rounded-md bg-primary-foreground/20 hover:bg-primary-foreground/30 transition-colors text-sm font-semibold uppercase"
            >
              {language === 'de' ? 'EN' : 'DE'}
            </button>
            
            <a
              href="tel:112"
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary-foreground text-primary font-bold hover:opacity-90 transition-opacity"
            >
              <Phone className="h-5 w-5" />
              <span className="hidden sm:inline">{t.callEmergency}</span>
              <span className="sm:hidden">112</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

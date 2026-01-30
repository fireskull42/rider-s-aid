import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Ruler, Scale, User } from 'lucide-react';
import { Language, translations } from '@/lib/translations';

interface PhysicalDataCardProps {
  gender: string | null;
  weightKg: number | null;
  heightCm: number | null;
  language: Language;
}

export function PhysicalDataCard({ gender, weightKg, heightCm, language }: PhysicalDataCardProps) {
  const t = translations[language];
  
  const getGenderLabel = (g: string | null) => {
    if (!g) return t.notSpecified;
    const genderMap: Record<string, { de: string; en: string }> = {
      male: { de: 'Männlich', en: 'Male' },
      female: { de: 'Weiblich', en: 'Female' },
      diverse: { de: 'Divers', en: 'Diverse' },
    };
    return genderMap[g]?.[language] || g;
  };

  const hasData = gender || weightKg || heightCm;

  if (!hasData) return null;

  return (
    <Card className="border-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <User className="h-5 w-5" />
          {t.physicalData}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 text-center">
          {gender && (
            <div className="p-3 bg-muted rounded-lg">
              <User className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">{t.gender}</div>
              <div className="font-semibold">{getGenderLabel(gender)}</div>
            </div>
          )}
          {heightCm && (
            <div className="p-3 bg-muted rounded-lg">
              <Ruler className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">{t.height}</div>
              <div className="font-semibold">{heightCm} {t.cm}</div>
            </div>
          )}
          {weightKg && (
            <div className="p-3 bg-muted rounded-lg">
              <Scale className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">{t.weight}</div>
              <div className="font-semibold">{weightKg} {t.kg}</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

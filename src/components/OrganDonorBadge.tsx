import { Heart } from 'lucide-react';
import { Language, translations } from '@/lib/translations';

interface OrganDonorBadgeProps {
  isOrganDonor: boolean;
  language: Language;
}

export function OrganDonorBadge({ isOrganDonor, language }: OrganDonorBadgeProps) {
  const t = translations[language];

  if (!isOrganDonor) return null;

  return (
    <div className="flex items-center justify-center gap-3 p-4 bg-success/10 border-2 border-success rounded-lg">
      <Heart className="h-6 w-6 text-success" fill="currentColor" />
      <span className="text-lg font-semibold text-success">
        {t.organDonor}: {t.yes}
      </span>
    </div>
  );
}

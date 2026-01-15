import { Users, Phone } from 'lucide-react';
import { Language, translations } from '@/lib/translations';

interface Contact {
  name: string;
  relationship: string;
  phone: string;
}

interface EmergencyContactsCardProps {
  contacts: Contact[];
  language: Language;
}

export function EmergencyContactsCard({ contacts, language }: EmergencyContactsCardProps) {
  const t = translations[language];

  return (
    <div className="section-contact rounded-lg border-2 border-success/30 p-5">
      <div className="flex items-center gap-3 mb-4">
        <Users className="h-6 w-6 text-success" />
        <h3 className="text-emergency-base text-foreground">{t.emergencyContacts}</h3>
      </div>
      
      {contacts.length === 0 ? (
        <p className="text-muted-foreground text-lg">{t.notSpecified}</p>
      ) : (
        <ul className="space-y-4">
          {contacts.map((contact, index) => (
            <li key={index} className="border-b border-success/20 last:border-0 pb-4 last:pb-0">
              <div className="font-semibold text-lg text-foreground">{contact.name}</div>
              <div className="text-muted-foreground text-sm mb-2">{contact.relationship}</div>
              <a
                href={`tel:${contact.phone.replace(/\s/g, '')}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-success text-success-foreground rounded-md font-semibold hover:opacity-90 transition-opacity"
              >
                <Phone className="h-4 w-4" />
                {contact.phone}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

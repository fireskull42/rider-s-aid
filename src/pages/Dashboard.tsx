import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile, useUpdateProfile, useAllergies, useAddAllergy, useDeleteAllergy, useMedications, useAddMedication, useDeleteMedication, useConditions, useAddCondition, useDeleteCondition, useImplants, useAddImplant, useDeleteImplant, useEmergencyContacts, useAddEmergencyContact, useDeleteEmergencyContact } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Heart, LogOut, Eye, Link2, Copy, Plus, Trash2, User, Droplets, AlertCircle, Pill, Activity, Users } from 'lucide-react';
import { Language, translations, detectLanguage } from '@/lib/translations';
import { toast } from 'sonner';

const BLOOD_TYPES = ['A', 'B', 'AB', '0'] as const;
const RH_FACTORS = ['+', '-'] as const;
const SEVERITIES = ['mild', 'moderate', 'severe'] as const;

export default function Dashboard() {
  const [language] = useState<Language>(() => detectLanguage());
  const t = translations[language];
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuth();

  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: allergies = [] } = useAllergies();
  const { data: medications = [] } = useMedications();
  const { data: conditions = [] } = useConditions();
  const { data: implants = [] } = useImplants();
  const { data: emergencyContacts = [] } = useEmergencyContacts();

  const updateProfile = useUpdateProfile();
  const addAllergy = useAddAllergy();
  const deleteAllergy = useDeleteAllergy();
  const addMedication = useAddMedication();
  const deleteMedication = useDeleteMedication();
  const addCondition = useAddCondition();
  const deleteCondition = useDeleteCondition();
  const addImplant = useAddImplant();
  const deleteImplant = useDeleteImplant();
  const addEmergencyContact = useAddEmergencyContact();
  const deleteEmergencyContact = useDeleteEmergencyContact();

  // Form states
  const [newAllergy, setNewAllergy] = useState({ name: '', type: 'other', severity: 'moderate' });
  const [newMedication, setNewMedication] = useState({ name: '', dosage: '', frequency: '' });
  const [newCondition, setNewCondition] = useState({ name: '' });
  const [newImplant, setNewImplant] = useState({ name: '', year: '' });
  const [newContact, setNewContact] = useState({ name: '', relationship: '', phone: '' });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const emergencyLink = user ? `${window.location.origin}/e/${user.id}` : '';

  const copyLink = () => {
    navigator.clipboard.writeText(emergencyLink);
    toast.success(t.linkCopied);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="emergency-banner text-primary-foreground py-4 px-4">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Heart className="h-8 w-8" />
            <span className="text-xl font-bold">RidersAid</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="bg-transparent border-white/30 text-white hover:bg-white/10"
              onClick={() => window.open(`/e/${user.id}`, '_blank')}
            >
              <Eye className="h-4 w-4 mr-2" />
              {t.preview}
            </Button>
            <Button
              variant="outline"
              className="bg-transparent border-white/30 text-white hover:bg-white/10"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              {t.logout}
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-6 space-y-6">
        {/* NFC Link Card */}
        <Card className="border-2 border-primary/30 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Link2 className="h-5 w-5 text-primary" />
              {t.yourEmergencyLink}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input value={emergencyLink} readOnly className="font-mono text-sm" />
              <Button onClick={copyLink} variant="outline">
                <Copy className="h-4 w-4 mr-2" />
                {t.copyLink}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {language === 'de' 
                ? 'Diesen Link auf deinen NFC-Tag schreiben. Rettungskräfte können ihn ohne Login öffnen.'
                : 'Write this link to your NFC tag. Emergency responders can open it without login.'}
            </p>
          </CardContent>
        </Card>

        {/* Personal Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {t.personalData}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t.fullName}</Label>
                <Input
                  value={profile?.full_name || ''}
                  onChange={(e) => updateProfile.mutate({ full_name: e.target.value })}
                  placeholder={language === 'de' ? 'Max Mustermann' : 'John Doe'}
                />
              </div>
              <div className="space-y-2">
                <Label>{t.birthDate}</Label>
                <Input
                  type="date"
                  value={profile?.birth_date || ''}
                  onChange={(e) => updateProfile.mutate({ birth_date: e.target.value || null })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Blood Type & Organ Donor */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-primary" />
              {t.bloodType} & {t.organDonor}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Blood Type Buttons */}
            <div className="space-y-3">
              <Label>{t.bloodType}</Label>
              <div className="flex flex-wrap gap-2">
                {BLOOD_TYPES.map((bt) => (
                  RH_FACTORS.map((rh) => (
                    <Button
                      key={`${bt}${rh}`}
                      variant={profile?.blood_type === bt && profile?.rh_factor === rh ? 'default' : 'outline'}
                      className="min-w-16 font-bold text-lg"
                      onClick={() => updateProfile.mutate({ blood_type: bt, rh_factor: rh })}
                    >
                      {bt}{rh}
                    </Button>
                  ))
                ))}
              </div>
            </div>

            {/* Organ Donor Toggle */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
              <div>
                <Label className="text-base font-semibold">{t.organDonor}</Label>
                <p className="text-sm text-muted-foreground">
                  {language === 'de' ? 'Bist du Organspender?' : 'Are you an organ donor?'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`font-semibold ${!profile?.is_organ_donor ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {t.no}
                </span>
                <Switch
                  checked={profile?.is_organ_donor || false}
                  onCheckedChange={(checked) => updateProfile.mutate({ is_organ_donor: checked })}
                />
                <span className={`font-semibold ${profile?.is_organ_donor ? 'text-success' : 'text-muted-foreground'}`}>
                  {t.yes}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Allergies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-accent" />
              {t.allergies}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {allergies.map((allergy) => (
              <div key={allergy.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${
                    allergy.severity === 'severe' ? 'bg-destructive' : allergy.severity === 'moderate' ? 'bg-warning' : 'bg-success'
                  }`} />
                  <span className="font-medium">{allergy.name}</span>
                  <span className="text-sm text-muted-foreground">({allergy.type})</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => deleteAllergy.mutate(allergy.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <Input
                placeholder={t.name}
                value={newAllergy.name}
                onChange={(e) => setNewAllergy({ ...newAllergy, name: e.target.value })}
              />
              <Input
                placeholder={t.type}
                value={newAllergy.type}
                onChange={(e) => setNewAllergy({ ...newAllergy, type: e.target.value })}
              />
              <Select value={newAllergy.severity} onValueChange={(v) => setNewAllergy({ ...newAllergy, severity: v })}>
                <SelectTrigger>
                  <SelectValue placeholder={t.severity} />
                </SelectTrigger>
                <SelectContent>
                  {SEVERITIES.map((s) => (
                    <SelectItem key={s} value={s}>{t[s]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={() => {
                  if (newAllergy.name) {
                    addAllergy.mutate(newAllergy);
                    setNewAllergy({ name: '', type: 'other', severity: 'moderate' });
                    toast.success(t.itemAdded);
                  }
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                {t.add}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Medications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5 text-info" />
              {t.medications}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {medications.map((med) => (
              <div key={med.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <span className="font-medium">{med.name}</span>
                  {med.dosage && <span className="text-muted-foreground ml-2">({med.dosage})</span>}
                  {med.frequency && <span className="text-muted-foreground ml-2">- {med.frequency}</span>}
                </div>
                <Button variant="ghost" size="icon" onClick={() => deleteMedication.mutate(med.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <Input
                placeholder={t.name}
                value={newMedication.name}
                onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
              />
              <Input
                placeholder={t.dosage}
                value={newMedication.dosage}
                onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
              />
              <Input
                placeholder={t.frequency}
                value={newMedication.frequency}
                onChange={(e) => setNewMedication({ ...newMedication, frequency: e.target.value })}
              />
              <Button
                onClick={() => {
                  if (newMedication.name) {
                    addMedication.mutate(newMedication);
                    setNewMedication({ name: '', dosage: '', frequency: '' });
                    toast.success(t.itemAdded);
                  }
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                {t.add}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Conditions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-info" />
              {t.conditions}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {conditions.map((cond) => (
              <div key={cond.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="font-medium">{cond.name}</span>
                <Button variant="ghost" size="icon" onClick={() => deleteCondition.mutate(cond.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Input
                placeholder={t.name}
                value={newCondition.name}
                onChange={(e) => setNewCondition({ name: e.target.value })}
              />
              <Button
                onClick={() => {
                  if (newCondition.name) {
                    addCondition.mutate(newCondition);
                    setNewCondition({ name: '' });
                    toast.success(t.itemAdded);
                  }
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                {t.add}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Implants */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-info" />
              {t.implants}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {implants.map((impl) => (
              <div key={impl.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <span className="font-medium">{impl.name}</span>
                  {impl.year && <span className="text-muted-foreground ml-2">({impl.year})</span>}
                </div>
                <Button variant="ghost" size="icon" onClick={() => deleteImplant.mutate(impl.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Input
                placeholder={t.name}
                value={newImplant.name}
                onChange={(e) => setNewImplant({ ...newImplant, name: e.target.value })}
              />
              <Input
                type="number"
                placeholder={t.year}
                value={newImplant.year}
                onChange={(e) => setNewImplant({ ...newImplant, year: e.target.value })}
              />
              <Button
                onClick={() => {
                  if (newImplant.name) {
                    addImplant.mutate({ name: newImplant.name, year: newImplant.year ? parseInt(newImplant.year) : null });
                    setNewImplant({ name: '', year: '' });
                    toast.success(t.itemAdded);
                  }
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                {t.add}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contacts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-success" />
              {t.emergencyContacts}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {emergencyContacts.map((contact) => (
              <div key={contact.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <span className="font-medium">{contact.name}</span>
                  <span className="text-muted-foreground ml-2">({contact.relationship})</span>
                  <span className="text-primary ml-2 font-mono">{contact.phone}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => deleteEmergencyContact.mutate(contact.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <Input
                placeholder={t.name}
                value={newContact.name}
                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
              />
              <Input
                placeholder={t.relationship}
                value={newContact.relationship}
                onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
              />
              <Input
                placeholder={t.phone}
                type="tel"
                value={newContact.phone}
                onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
              />
              <Button
                onClick={() => {
                  if (newContact.name && newContact.phone) {
                    addEmergencyContact.mutate(newContact);
                    setNewContact({ name: '', relationship: '', phone: '' });
                    toast.success(t.itemAdded);
                  }
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                {t.add}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

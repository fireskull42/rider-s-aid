import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Heart, Shield } from 'lucide-react';
import { Language, translations, detectLanguage } from '@/lib/translations';
import { toast } from 'sonner';
import { z } from 'zod';

const emailSchema = z.string().email();
const passwordSchema = z.string().min(6);

export default function Auth() {
  const [language] = useState<Language>(() => detectLanguage());
  const t = translations[language];
  const navigate = useNavigate();
  const { user, signIn, signUp, loading } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerName, setRegisterName] = useState('');

  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      emailSchema.parse(loginEmail);
      passwordSchema.parse(loginPassword);
    } catch {
      toast.error(language === 'de' ? 'Bitte gültige E-Mail und Passwort (min. 6 Zeichen) eingeben' : 'Please enter valid email and password (min. 6 characters)');
      return;
    }

    setIsLoading(true);
    const { error } = await signIn(loginEmail, loginPassword);
    setIsLoading(false);

    if (error) {
      toast.error(t.loginError + ': ' + error.message);
    } else {
      toast.success(language === 'de' ? 'Erfolgreich angemeldet!' : 'Successfully logged in!');
      navigate('/dashboard');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      emailSchema.parse(registerEmail);
      passwordSchema.parse(registerPassword);
    } catch {
      toast.error(language === 'de' ? 'Bitte gültige E-Mail und Passwort (min. 6 Zeichen) eingeben' : 'Please enter valid email and password (min. 6 characters)');
      return;
    }

    if (!registerName.trim()) {
      toast.error(language === 'de' ? 'Bitte Namen eingeben' : 'Please enter your name');
      return;
    }

    setIsLoading(true);
    const { error } = await signUp(registerEmail, registerPassword, registerName);
    setIsLoading(false);

    if (error) {
      if (error.message.includes('already registered')) {
        toast.error(language === 'de' ? 'Diese E-Mail ist bereits registriert' : 'This email is already registered');
      } else {
        toast.error(t.registerError + ': ' + error.message);
      }
    } else {
      toast.success(language === 'de' ? 'Konto erstellt! Du kannst dich jetzt anmelden.' : 'Account created! You can now log in.');
      navigate('/dashboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="emergency-banner text-primary-foreground py-4 px-4">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Heart className="h-8 w-8" />
            <span className="text-xl font-bold">RidersAid</span>
          </div>
          <Button 
            variant="outline" 
            className="bg-transparent border-white/30 text-white hover:bg-white/10"
            onClick={() => navigate('/')}
          >
            {language === 'de' ? 'Zurück' : 'Back'}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container py-8 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Shield className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl">
              {language === 'de' ? 'Willkommen bei RidersAid' : 'Welcome to RidersAid'}
            </CardTitle>
            <CardDescription>
              {language === 'de' 
                ? 'Erstelle dein Notfall-Profil für den NFC-Tag'
                : 'Create your emergency profile for NFC tag'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">{t.login}</TabsTrigger>
                <TabsTrigger value="register">{t.register}</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4 mt-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">{t.email}</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="name@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">{t.password}</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? t.saving : t.login}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="space-y-4 mt-4">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">{t.fullName}</Label>
                    <Input
                      id="register-name"
                      type="text"
                      placeholder={language === 'de' ? 'Max Mustermann' : 'John Doe'}
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">{t.email}</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="name@example.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">{t.password}</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="••••••••"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? t.saving : t.createAccount}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  {language === 'de'
                    ? 'Deine Notfall-Daten werden verschlüsselt gespeichert und sind nur über deinen persönlichen NFC-Link abrufbar.'
                    : 'Your emergency data is stored encrypted and only accessible via your personal NFC link.'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}


import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import AppLayout from "@/components/AppLayout";
import { Settings as SettingsIcon, User, Globe, Lock } from "lucide-react";

const Settings = () => {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const { user } = useAuth();
  
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    toast.success(`${t('settings.language')} ${value === 'en' ? t('settings.english') : t('settings.arabic')}`);
  };
  
  const handleChangePIN = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPin !== confirmPin) {
      toast.error("New PIN and confirm PIN do not match");
      return;
    }
    
    const hashedPin = await new Promise<string>((resolve) => {
      const hash = password_hash(newPin, 'bcrypt');
      resolve(hash);
    });
    
    setIsSubmitting(true);
    
    // API call
    // await changePin(hashedPin);
    
    setTimeout(() => {
      toast.success("PIN updated successfully");
      setCurrentPin("");
      setNewPin(hashedPin);
      setConfirmPin("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{t('settings.title')}</h1>
        </div>
        
        <Tabs defaultValue="profile">
          <TabsList>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {t('settings.profile')}
            </TabsTrigger>
            <TabsTrigger value="language" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              {t('settings.language')}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('settings.profile')}</CardTitle>
                <CardDescription>
                  {t('users.employeeNumber')}: {user?.employeeNumber}<br />
                  {t('users.email')}: {user?.email}<br />
                  {t('users.department')}: {user?.department}<br />
                  {t('users.role')}: {user?.role}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangePIN} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-pin">{t('settings.currentPin')}</Label>
                    <Input
                      id="current-pin"
                      type="password"
                      value={currentPin}
                      onChange={(e) => setCurrentPin(e.target.value)}
                      required
                      maxLength={4}
                      minLength={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-pin">{t('settings.newPin')}</Label>
                    <Input
                      id="new-pin"
                      type="password"
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value)}
                      required
                      maxLength={4}
                      minLength={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-pin">{t('settings.confirmPin')}</Label>
                    <Input
                      id="confirm-pin"
                      type="password"
                      value={confirmPin}
                      onChange={(e) => setConfirmPin(e.target.value)}
                      required
                      maxLength={4}
                      minLength={4}
                    />
                  </div>
                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? t('common.loading') : t('settings.changePin')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="language" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('settings.language')}</CardTitle>
                <CardDescription>
                  {t('settings.language')} {language === 'en' ? t('settings.english') : t('settings.arabic')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="language">{t('settings.language')}</Label>
                  <Select value={language} onValueChange={handleLanguageChange}>
                    <SelectTrigger id="language">
                      <SelectValue placeholder={t('settings.language')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">{t('settings.english')} ({t('settings.ltr')})</SelectItem>
                      <SelectItem value="ar">{t('settings.arabic')} ({t('settings.rtl')})</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Settings;

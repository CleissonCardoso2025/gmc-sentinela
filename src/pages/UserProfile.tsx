
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { updateGcmRibeiraProfile } from '../scripts/updateGcmRibeiraProfile';
import { toast } from 'sonner';
import { RefreshCcw, ShieldCheck } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isSpecialUser, setIsSpecialUser] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<number | null>(null);
  
  useEffect(() => {
    // Get user profile from localStorage
    const profile = localStorage.getItem('userProfile') || '';
    const email = localStorage.getItem('userEmail') || '';
    setUserProfile(profile);
    setUserEmail(email);
    
    // Check if user is an admin (has Inspetor role)
    setIsAdmin(profile === 'Inspetor');
    
    // Check if this is our special user
    setIsSpecialUser(email === 'gcmribeiradopombal@hotmail.com');
  }, []);
  
  const handleUpdateGcmRibeiraProfile = async () => {
    // Prevent multiple rapid update attempts (within 3 seconds)
    const now = Date.now();
    if (lastUpdateTime && now - lastUpdateTime < 3000) {
      toast.info("Por favor, aguarde alguns segundos antes de tentar novamente");
      return;
    }
    
    setIsUpdating(true);
    setLastUpdateTime(now);
    
    const success = await updateGcmRibeiraProfile();
    if (success) {
      if (userEmail === 'gcmribeiradopombal@hotmail.com') {
        setUserProfile('Inspetor');
        setIsAdmin(true);
      }
    }
    
    setIsUpdating(false);
  };
  
  return (
    <div className="container py-10 px-4 md:px-6 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8">Perfil do Usuário</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações do Perfil</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nome</p>
                <p>Usuário Atual</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p>{userEmail}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Perfil</p>
                <div className="flex items-center gap-2">
                  <p>{userProfile}</p>
                  {isAdmin && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span><ShieldCheck className="h-4 w-4 text-green-500" /></span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Administrador</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </div>
              
              {isSpecialUser && !isAdmin && (
                <div className="pt-4 border-t mt-6">
                  <h3 className="text-lg font-semibold mb-2">Atualizar Perfil</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Seu usuário tem acesso a funcionalidades administrativas, mas o seu perfil ainda não está configurado como Inspetor.
                  </p>
                  <Button 
                    variant="default"
                    onClick={handleUpdateGcmRibeiraProfile}
                    className="gap-2"
                    disabled={isUpdating}
                  >
                    <RefreshCcw className={`h-4 w-4 ${isUpdating ? 'animate-spin' : ''}`} />
                    {isUpdating ? 'Atualizando...' : 'Atualizar meu perfil para Inspetor'}
                  </Button>
                </div>
              )}
              
              {isAdmin && (
                <div className="pt-4 border-t mt-6">
                  <h3 className="text-lg font-semibold mb-2">Ações de Administrador</h3>
                  <Button 
                    variant="secondary" 
                    onClick={handleUpdateGcmRibeiraProfile}
                    className="gap-2"
                    disabled={isUpdating}
                  >
                    <RefreshCcw className={`h-4 w-4 ${isUpdating ? 'animate-spin' : ''}`} />
                    {isUpdating ? 'Verificando...' : 'Verificar perfil do gcmribeiradopombal@hotmail.com'}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;

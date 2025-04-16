
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { updateGcmRibeiraProfile, initializeProfileCheck } from '../scripts/updateGcmRibeiraProfile';
import { toast } from 'sonner';
import { RefreshCcw, ShieldCheck } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isSpecialUser, setIsSpecialUser] = useState<boolean>(false);
  const [isCheckingProfile, setIsCheckingProfile] = useState<boolean>(false);
  
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
    
    // Initialize profile check once
    if (email === 'gcmribeiradopombal@hotmail.com') {
      initializeProfileCheck();
    }
  }, []);
  
  // Listen for auth state changes to update profile
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'USER_UPDATED') {
        const role = session?.user?.user_metadata?.role;
        if (role && role !== userProfile) {
          console.log('User role updated in auth state:', role);
          setUserProfile(role);
          setIsAdmin(role === 'Inspetor');
          localStorage.setItem('userProfile', role);
        }
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [userProfile]);
  
  const handleUpdateGcmRibeiraProfile = async () => {
    setIsCheckingProfile(true);
    try {
      const updated = await updateGcmRibeiraProfile();
      if (updated) {
        toast.success("Perfil do usuário gcmribeiradopombal@hotmail.com atualizado para Inspetor");
        if (userEmail === 'gcmribeiradopombal@hotmail.com') {
          setUserProfile('Inspetor');
          setIsAdmin(true);
        }
      } else {
        toast.info("Nenhuma atualização necessária para o perfil");
      }
    } finally {
      setIsCheckingProfile(false);
    }
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
                    disabled={isCheckingProfile}
                  >
                    {isCheckingProfile ? (
                      <>Verificando...</>
                    ) : (
                      <>
                        <RefreshCcw className="h-4 w-4" />
                        Atualizar meu perfil para Inspetor
                      </>
                    )}
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
                    disabled={isCheckingProfile}
                  >
                    {isCheckingProfile ? (
                      <>Verificando...</>
                    ) : (
                      <>
                        <RefreshCcw className="h-4 w-4" />
                        Atualizar perfil do gcmribeiradopombal@hotmail.com para Inspetor
                      </>
                    )}
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

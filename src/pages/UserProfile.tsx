
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { updateGcmRibeiraProfile } from '../scripts/updateGcmRibeiraProfile';
import { toast } from 'sonner';

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  
  useEffect(() => {
    // Get user profile from localStorage
    const profile = localStorage.getItem('userProfile') || '';
    const email = localStorage.getItem('userEmail') || '';
    setUserProfile(profile);
    setUserEmail(email);
    
    // Check if user is an admin (has Inspetor role)
    setIsAdmin(profile === 'Inspetor');
  }, []);
  
  const handleUpdateGcmRibeiraProfile = async () => {
    if (isAdmin) {
      await updateGcmRibeiraProfile();
      toast.success("Perfil do usuário gcmribeiradopombal@hotmail.com atualizado para Inspetor");
    } else {
      toast.error("Apenas administradores podem realizar esta ação");
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
                <p>{userProfile}</p>
              </div>
              
              {isAdmin && (
                <div className="pt-4 border-t mt-6">
                  <h3 className="text-lg font-semibold mb-2">Ações de Administrador</h3>
                  <Button 
                    variant="secondary" 
                    onClick={handleUpdateGcmRibeiraProfile}
                  >
                    Atualizar perfil do gcmribeiradopombal@hotmail.com para Inspetor
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

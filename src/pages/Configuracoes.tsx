import React, { useEffect } from 'react';
import UserManagement from '@/components/Configuracoes/UserManagement';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardLayout from '@/layouts/Dashboard';
import { updateGcmRibeiraProfile } from '@/scripts/updateGcmRibeiraProfile';

const Configuracoes = () => {
  const userProfile = localStorage.getItem('userProfile') || '';
  const userEmail = localStorage.getItem('userEmail') || '';

  // Update special profile if needed
  useEffect(() => {
    if (userEmail === 'gcmribeiradopombal@hotmail.com') {
      updateGcmRibeiraProfile();
    }
  }, [userEmail]);

  return (
    <DashboardLayout>
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-6">Configurações</h1>
        <Tabs defaultValue="usuarios" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="usuarios">Usuários</TabsTrigger>
            <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
          </TabsList>

          <TabsContent value="usuarios">
            <UserManagement />
          </TabsContent>

          <TabsContent value="notificacoes">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Notificações</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Preferências de notificações serão implementadas aqui.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Configuracoes;

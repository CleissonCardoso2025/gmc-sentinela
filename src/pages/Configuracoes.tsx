
import React from 'react';
import UserManagement from '@/components/Configuracoes/UserManagement';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardLayout from '@/layouts/Dashboard';
import PageAccessControl from '@/components/Configuracoes/PageAccessControl';
import { Shield } from 'lucide-react';
import { useAuthorization } from '@/hooks/use-authorization';

const Configuracoes = () => {
  // Get the user profile from localStorage
  const userProfile = localStorage.getItem('userProfile') || 'Inspetor';
  const { pageAccessSettings, updatePageAccess, isLoading: isLoadingAccess } = useAuthorization(userProfile);

  const handleSavePageAccess = async (pages: typeof pageAccessSettings): Promise<void> => {
    try {
      const success = updatePageAccess(pages);
      return Promise.resolve();
    } catch (error) {
      console.error('Error saving page access:', error);
      return Promise.reject(error);
    }
  };

  return (
    <DashboardLayout>
      <div className="container py-10 px-4 md:px-6 max-w-7xl">
        <h1 className="text-3xl font-bold mb-8">Configurações</h1>

        <Tabs defaultValue="usuarios" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="usuarios">Usuários</TabsTrigger>
            <TabsTrigger value="acessos">
              <div className="flex items-center gap-1">
                <Shield className="h-4 w-4" />
                Controle de Acesso
              </div>
            </TabsTrigger>
            <TabsTrigger value="sistema">Sistema</TabsTrigger>
            <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
          </TabsList>

          <TabsContent value="usuarios">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciamento de Usuários</CardTitle>
              </CardHeader>
              <CardContent>
                <UserManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="acessos">
            <Card>
              <CardHeader>
                <CardTitle>Controle de Acesso às Páginas</CardTitle>
              </CardHeader>
              <CardContent>
                {userProfile === 'Inspetor' ? (
                  <PageAccessControl
                    initialPages={pageAccessSettings}
                    isLoading={isLoadingAccess}
                    onSave={handleSavePageAccess}
                    onCancel={() => {}} // No-op since this is embedded in the page
                  />
                ) : (
                  <div className="p-4 bg-yellow-50 text-yellow-800 rounded-md">
                    <h3 className="font-semibold text-lg">Acesso Restrito</h3>
                    <p>Você não tem permissão para acessar esta funcionalidade. Apenas usuários com perfil de Inspetor podem gerenciar permissões de acesso.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sistema">
            <Card>
              <CardHeader>
                <CardTitle>Configurações do Sistema</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Configurações gerais do sistema serão implementadas aqui.
                </p>
              </CardContent>
            </Card>
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

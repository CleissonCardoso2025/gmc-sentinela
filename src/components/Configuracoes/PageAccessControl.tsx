
import React, { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';

// Define page access structure
export type PageAccess = {
  id: string;
  name: string;
  path: string;
  allowedProfiles: ('Inspetor' | 'Subinspetor' | 'Supervisor' | 'Corregedor' | 'Agente')[];
};

// Available profiles
export const availableProfiles = ['Inspetor', 'Subinspetor', 'Supervisor', 'Corregedor', 'Agente'] as const;

interface PageAccessControlProps {
  initialPages: PageAccess[];
  isLoading?: boolean;
  onSave: (pages: PageAccess[]) => void;
  onCancel: () => void;
}

const PageAccessControl: React.FC<PageAccessControlProps> = ({ 
  initialPages,
  isLoading = false,
  onSave, 
  onCancel 
}) => {
  const [pages, setPages] = useState<PageAccess[]>(initialPages);
  const [hasChanges, setHasChanges] = useState(false);
  
  const toggleAccess = (pageId: string, profile: string) => {
    setPages(prevPages => 
      prevPages.map(page => {
        if (page.id === pageId) {
          const profileType = profile as 'Inspetor' | 'Subinspetor' | 'Supervisor' | 'Corregedor' | 'Agente';
          
          let updatedAllowedProfiles: typeof page.allowedProfiles;
          
          if (page.allowedProfiles.includes(profileType)) {
            updatedAllowedProfiles = page.allowedProfiles.filter(p => p !== profileType);
          } else {
            updatedAllowedProfiles = [...page.allowedProfiles, profileType];
          }
          
          return {
            ...page,
            allowedProfiles: updatedAllowedProfiles
          };
        }
        return page;
      })
    );
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(pages);
    setHasChanges(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Controle de Acesso às Páginas</CardTitle>
        <CardDescription>
          Configure quais perfis podem acessar cada página da aplicação
        </CardDescription>
      </CardHeader>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left p-2 border">Página</th>
              {availableProfiles.map(profile => (
                <th key={profile} className="text-center p-2 border">{profile}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pages.map(page => (
              <tr key={page.id} className="border-b hover:bg-muted/20">
                <td className="p-2 border">{page.name}</td>
                {availableProfiles.map(profile => (
                  <td key={`${page.id}-${profile}`} className="text-center p-2 border">
                    <Switch
                      checked={page.allowedProfiles.includes(profile as any)}
                      onCheckedChange={() => toggleAccess(page.id, profile)}
                      className="data-[state=checked]:bg-green-500"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              type="button" 
              variant="default"
              disabled={!hasChanges}
            >
              Salvar Alterações
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Alterações</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação irá alterar as permissões de acesso às páginas para todos os usuários dos perfis afetados. Deseja continuar?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleSave}>Confirmar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default PageAccessControl;

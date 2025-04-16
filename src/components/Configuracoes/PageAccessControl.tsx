
import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { getAllRoles, togglePageAccess } from '@/services/pageAccessService';
import { toast } from 'sonner';

// Define page access structure
export type PageAccess = {
  id: string;
  name: string;
  path: string;
  allowedProfiles: string[];
};

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
  const [availableProfiles, setAvailableProfiles] = useState<string[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  
  // Fetch roles from the database
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoadingProfiles(true);
        const roles = await getAllRoles();
        
        console.log("PageAccessControl - Fetched roles:", roles);
        
        // If no roles returned, use default roles
        if (!roles || roles.length === 0) {
          setAvailableProfiles(['Inspetor', 'Subinspetor', 'Supervisor', 'Corregedor', 'Agente', 'Motorista', 'Monitor']);
        } else {
          setAvailableProfiles(roles);
        }
      } catch (error) {
        console.error('Error fetching roles:', error);
        // Fallback to default roles
        setAvailableProfiles(['Inspetor', 'Subinspetor', 'Supervisor', 'Corregedor', 'Agente', 'Motorista', 'Monitor']);
      } finally {
        setLoadingProfiles(false);
      }
    };

    fetchRoles();
  }, []);

  // Update local state when initialPages changes
  useEffect(() => {
    setPages(initialPages);
    setHasChanges(false);
  }, [initialPages]);
  
  const toggleAccess = async (pageId: string, profile: string) => {
    // Find the page
    const pageToUpdate = pages.find(page => page.id === pageId);
    if (!pageToUpdate) return;
    
    // Determine the new access state
    const currentlyHasAccess = pageToUpdate.allowedProfiles.includes(profile);
    const newHasAccess = !currentlyHasAccess;
    
    // Clone the pages array to avoid direct state mutation
    const updatedPages = pages.map(page => {
      if (page.id === pageId) {
        let updatedAllowedProfiles: string[];
        
        if (currentlyHasAccess) {
          // Remove profile from allowed profiles
          updatedAllowedProfiles = page.allowedProfiles.filter(p => p !== profile);
        } else {
          // Add profile to allowed profiles
          updatedAllowedProfiles = [...page.allowedProfiles, profile];
        }
        
        return {
          ...page,
          allowedProfiles: updatedAllowedProfiles
        };
      }
      return page;
    });
    
    // Update local state immediately (optimistic update)
    setPages(updatedPages);
    setHasChanges(true);
    
    try {
      // Update the database in the background
      const success = await togglePageAccess(pageId, pageToUpdate.name, profile, newHasAccess);
      
      if (!success) {
        // If update fails, revert to the previous state
        toast.error(`Erro ao atualizar permissão para ${profile} em ${pageToUpdate.name}`);
        setPages(pages); // Revert to previous state
      }
    } catch (error) {
      console.error('Error toggling access:', error);
      toast.error('Erro ao atualizar permissão');
      // Revert to previous state on error
      setPages(pages);
    }
  };

  const handleSave = () => {
    onSave(pages);
    setHasChanges(false);
  };

  if (isLoading || loadingProfiles) {
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
                      checked={page.allowedProfiles.includes(profile)}
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

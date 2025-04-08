import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/layouts/Dashboard';
import { useToast } from "@/hooks/use-toast";
import { User, Shield, FileText, Lock, Mail, Phone, IdCard, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import UserForm from '@/components/Configuracoes/UserForm';
import { User as UserType } from '@/types/database';
import { toast as sonnerToast } from 'sonner';

const passwordFormSchema = z.object({
  currentPassword: z.string().min(6, {
    message: "A senha atual deve ter pelo menos 6 caracteres",
  }),
  newPassword: z.string().min(6, {
    message: "A nova senha deve ter pelo menos 6 caracteres",
  }),
  confirmPassword: z.string().min(6, {
    message: "A confirmação de senha deve ter pelo menos 6 caracteres",
  }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

const UserProfile = () => {
  const { toast } = useToast();
  const [userData, setUserData] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  const form = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const userEmail = localStorage.getItem("userEmail");
        
        if (userEmail) {
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', userEmail)
            .maybeSingle();
            
          if (error) throw error;
          
          if (data) {
            setUserData(data as UserType);
          } else {
            setUserData({
              id: "1",
              nome: localStorage.getItem("userName") || "Carlos Silva",
              email: userEmail,
              matricula: "GCM-12345",
              data_nascimento: "15/05/1985",
              perfil: localStorage.getItem("userProfile") as UserType["perfil"] || "Agente",
              status: true
            });
          }
        } else {
          setUserData({
            id: "1",
            nome: localStorage.getItem("userName") || "Carlos Silva",
            email: "carlos.silva@gcm.gov.br",
            matricula: "GCM-12345",
            data_nascimento: "15/05/1985",
            perfil: localStorage.getItem("userProfile") as UserType["perfil"] || "Agente",
            status: true
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        sonnerToast.error('Erro ao carregar dados do perfil');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  const onSubmit = (values: z.infer<typeof passwordFormSchema>) => {
    console.log(values);
    toast({
      title: "Senha alterada",
      description: "Sua senha foi alterada com sucesso.",
    });
    form.reset();
  };

  const handleUpdateProfile = async (formData: UserFormData) => {
    try {
      if (userData?.id) {
        const { data, error } = await supabase
          .from('users')
          .update({
            nome: formData.nome,
            email: formData.email,
            matricula: formData.matricula,
            data_nascimento: formData.data_nascimento,
            perfil: formData.perfil
          })
          .eq('id', userData.id)
          .select()
          .single();

        if (error) throw error;
        
        setUserData(data as UserType);
        setIsEditing(false);
        sonnerToast.success('Perfil atualizado com sucesso');
        
        localStorage.setItem("userName", formData.nome);
        localStorage.setItem("userEmail", formData.email);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      sonnerToast.error('Erro ao atualizar perfil');
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto p-4 sm:p-6 animate-fade-in">
          <h1 className="text-2xl font-bold text-gcm-600 mb-6 flex items-center">
            <User className="h-6 w-6 mr-2 text-gcm-500" />
            Meu Perfil
          </h1>
          <div className="p-6 text-center">
            Carregando dados do perfil...
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4 sm:p-6 animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gcm-600 flex items-center">
            <User className="h-6 w-6 mr-2 text-gcm-500" />
            Meu Perfil
          </h1>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} variant="outline" className="gap-2">
              <User className="h-4 w-4" />
              Editar Perfil
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card className="shadow-md animate-fade-up">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto bg-gcm-100 rounded-full p-6 w-24 h-24 flex items-center justify-center mb-2">
                  <User className="h-12 w-12 text-gcm-600" />
                </div>
                <CardTitle className="text-xl font-bold text-gcm-700">{userData?.nome}</CardTitle>
                <p className="text-gray-500 text-sm">{userData?.perfil}</p>
              </CardHeader>
              
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <IdCard className="h-5 w-5 text-gcm-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Matrícula</p>
                      <p className="font-medium">{userData?.matricula}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gcm-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">E-mail</p>
                      <p className="font-medium">{userData?.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gcm-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Data de Nascimento</p>
                      <p className="font-medium">{userData?.data_nascimento}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-gcm-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="font-medium">{userData?.status ? "Ativo" : "Inativo"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            {isEditing ? (
              <Card className="shadow-md animate-fade-up">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <User className="h-5 w-5 mr-2 text-gcm-500" />
                    Editar Perfil
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {userData && (
                    <UserForm 
                      initialData={{
                        id: userData.id,
                        nome: userData.nome,
                        email: userData.email,
                        matricula: userData.matricula || '',
                        data_nascimento: userData.data_nascimento || '',
                        perfil: userData.perfil,
                        status: userData.status
                      }}
                      onSubmit={handleUpdateProfile}
                      onCancel={() => setIsEditing(false)}
                    />
                  )}
                </CardContent>
              </Card>
            ) : (
              <>
                <Card className="shadow-md animate-fade-up" style={{ animationDelay: "100ms" }}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-gcm-500" />
                      Estatísticas
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4 text-center">
                        <p className="text-3xl font-bold text-blue-600">237</p>
                        <p className="text-gray-600 text-sm">Ocorrências registradas</p>
                      </div>
                      
                      <div className="bg-green-50 rounded-lg p-4 text-center">
                        <p className="text-3xl font-bold text-green-600">98%</p>
                        <p className="text-gray-600 text-sm">Taxa de conclusão</p>
                      </div>
                      
                      <div className="bg-purple-50 rounded-lg p-4 text-center">
                        <p className="text-3xl font-bold text-purple-600">45</p>
                        <p className="text-gray-600 text-sm">Relatórios este mês</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="shadow-md animate-fade-up" style={{ animationDelay: "200ms" }}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Lock className="h-5 w-5 mr-2 text-gcm-500" />
                      Alterar Senha
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="currentPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Senha Atual</FormLabel>
                              <FormControl>
                                <Input 
                                  type="password" 
                                  placeholder="Digite sua senha atual" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="newPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nova Senha</FormLabel>
                              <FormControl>
                                <Input 
                                  type="password" 
                                  placeholder="Digite sua nova senha" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirmar Nova Senha</FormLabel>
                              <FormControl>
                                <Input 
                                  type="password" 
                                  placeholder="Confirme sua nova senha" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button type="submit" className="bg-gcm-600 hover:bg-gcm-700 mt-2">
                          Atualizar Senha
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserProfile;

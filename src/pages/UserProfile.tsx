
import React from 'react';
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
  
  const form = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: z.infer<typeof passwordFormSchema>) => {
    // In a real app, this would call an API to update the password
    console.log(values);
    toast({
      title: "Senha alterada",
      description: "Sua senha foi alterada com sucesso.",
    });
    form.reset();
  };

  // Mock user data
  const userData = {
    name: "Carlos Silva",
    email: "carlos.silva@gcm.gov.br",
    phone: "(11) 98765-4321",
    registrationNumber: "GCM-12345",
    joiningDate: "15/03/2020",
    department: "Patrulhamento",
    rank: "Guarda Civil Municipal - 2ª Classe",
    occurrencesCount: 237
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4 sm:p-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-gcm-600 mb-6 flex items-center">
          <User className="h-6 w-6 mr-2 text-gcm-500" />
          Meu Perfil
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Info Card */}
          <div className="lg:col-span-1">
            <Card className="shadow-md animate-fade-up">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto bg-gcm-100 rounded-full p-6 w-24 h-24 flex items-center justify-center mb-2">
                  <User className="h-12 w-12 text-gcm-600" />
                </div>
                <CardTitle className="text-xl font-bold text-gcm-700">{userData.name}</CardTitle>
                <p className="text-gray-500 text-sm">{userData.rank}</p>
              </CardHeader>
              
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <IdCard className="h-5 w-5 text-gcm-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Matrícula</p>
                      <p className="font-medium">{userData.registrationNumber}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gcm-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">E-mail</p>
                      <p className="font-medium">{userData.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gcm-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Telefone</p>
                      <p className="font-medium">{userData.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gcm-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Data de Admissão</p>
                      <p className="font-medium">{userData.joiningDate}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-gcm-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Departamento</p>
                      <p className="font-medium">{userData.department}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Card */}
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
                    <p className="text-3xl font-bold text-blue-600">{userData.occurrencesCount}</p>
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
            
            {/* Password Change Card */}
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
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserProfile;

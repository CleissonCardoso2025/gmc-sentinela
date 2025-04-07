
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/layouts/Dashboard';
import { FileText, MapPin, Calendar, Clock, User, FileDown, ArrowLeft, Shield, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const OccurrenceDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // In a real app, this would be fetched from an API
  const occurrenceData = {
    id: Number(id),
    numero: Number(id),
    titulo: "Perturbação do sossego público",
    tipo: "Contravenção",
    data: "07/04/2025",
    hora: "15:30",
    local: "Rua das Flores, 123 - Centro",
    descricao: "Denúncia de som alto em residência após as 22h. Morador vizinho relatou que já solicitou por diversas vezes a redução do volume, sem sucesso.",
    status: "aberta",
    responsavel: "GCM Carlos Silva",
    envolvidos: [
      {
        nome: "João Santos",
        apelido: "João",
        dataNascimento: "12/05/1985",
        rg: "12.345.678-9",
        cpf: "123.456.789-00",
        endereco: "Rua das Acácias, 456 - Centro",
        telefone: "(11) 98765-4321",
        vinculo: "Denunciado",
        estadoAparente: "Lúcido"
      },
      {
        nome: "Maria Oliveira",
        apelido: "",
        dataNascimento: "23/09/1978",
        rg: "23.456.789-0",
        cpf: "234.567.890-01",
        endereco: "Rua das Flores, 127 - Centro",
        telefone: "(11) 91234-5678",
        vinculo: "Denunciante",
        estadoAparente: "Lúcido"
      }
    ],
    providencias: [
      "Orientação às partes",
      "Notificação por escrito"
    ],
    gcms: [
      {
        nome: "Carlos Silva",
        matricula: "GCM-12345",
        posto: "Guarda Civil Municipal - 2ª Classe"
      },
      {
        nome: "Ana Oliveira",
        matricula: "GCM-23456",
        posto: "Guarda Civil Municipal - 1ª Classe"
      }
    ]
  };

  const handleGeneratePDF = () => {
    // In a real app, this would trigger an API call to generate a PDF
    toast({
      title: "PDF Gerado",
      description: `O relatório da ocorrência #${id} foi gerado com sucesso.`,
    });
  };

  const handleGoBack = () => {
    navigate('/ocorrencias?tab=lista');
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4 sm:p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2" 
              onClick={handleGoBack}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gcm-600 flex items-center">
              <FileText className="h-6 w-6 mr-2 text-gcm-500" />
              Ocorrência #{occurrenceData.numero}
            </h1>
          </div>
          
          <Button 
            variant="outline" 
            onClick={handleGeneratePDF}
            className="bg-white"
          >
            <FileDown className="h-4 w-4 mr-2" />
            Gerar PDF
          </Button>
        </div>
        
        {/* Main Info Card */}
        <Card className="shadow-md mb-6 animate-fade-up">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-xl">{occurrenceData.titulo}</CardTitle>
              {occurrenceData.status === 'aberta' ? (
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">Aberta</Badge>
              ) : occurrenceData.status === 'concluída' ? (
                <Badge className="bg-green-100 text-green-800 border-green-200">Concluída</Badge>
              ) : (
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Em andamento</Badge>
              )}
            </div>
            <Badge variant="outline" className="mb-4">
              {occurrenceData.tipo}
            </Badge>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gcm-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Data</p>
                  <p className="font-medium">{occurrenceData.data}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gcm-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Hora</p>
                  <p className="font-medium">{occurrenceData.hora}</p>
                </div>
              </div>
              
              <div className="flex items-center md:col-span-2">
                <MapPin className="h-5 w-5 text-gcm-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Local</p>
                  <p className="font-medium">{occurrenceData.local}</p>
                </div>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div>
              <h3 className="font-medium mb-2 text-gcm-700">Descrição da Ocorrência</h3>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-md border">
                {occurrenceData.descricao}
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Envolvidos Card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="shadow-md animate-fade-up" style={{ animationDelay: "100ms" }}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <User className="h-5 w-5 mr-2 text-gcm-500" />
                Envolvidos
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {occurrenceData.envolvidos.map((envolvido, index) => (
                <div 
                  key={index} 
                  className={cn(
                    "border rounded-md p-4 transition-all hover:shadow-sm",
                    envolvido.vinculo === "Denunciado" ? "border-l-4 border-l-yellow-500" : "border-l-4 border-l-blue-500"
                  )}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{envolvido.nome} {envolvido.apelido && `(${envolvido.apelido})`}</h3>
                    <Badge 
                      variant="outline" 
                      className={envolvido.vinculo === "Denunciado" ? 
                        "bg-yellow-50 text-yellow-800 border-yellow-200" : 
                        "bg-blue-50 text-blue-800 border-blue-200"}
                    >
                      {envolvido.vinculo}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-sm">
                    <div>
                      <span className="text-gray-500">Data de Nascimento:</span> {envolvido.dataNascimento}
                    </div>
                    <div>
                      <span className="text-gray-500">Estado Aparente:</span> {envolvido.estadoAparente}
                    </div>
                    <div>
                      <span className="text-gray-500">RG:</span> {envolvido.rg}
                    </div>
                    <div>
                      <span className="text-gray-500">CPF:</span> {envolvido.cpf}
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-gray-500">Endereço:</span> {envolvido.endereco}
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-gray-500">Telefone:</span> {envolvido.telefone}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          
          <div className="space-y-6">
            {/* Providências Card */}
            <Card className="shadow-md animate-fade-up" style={{ animationDelay: "150ms" }}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <CheckCircle2 className="h-5 w-5 mr-2 text-gcm-500" />
                  Providências Tomadas
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {occurrenceData.providencias.map((providencia, index) => (
                    <li key={index} className="pl-2">{providencia}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            {/* GCMs Card */}
            <Card className="shadow-md animate-fade-up" style={{ animationDelay: "200ms" }}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-gcm-500" />
                  Guardas Envolvidos
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  {occurrenceData.gcms.map((gcm, index) => (
                    <div key={index} className="flex items-center border-l-4 border-l-gcm-500 bg-gray-50 p-3 rounded-md">
                      <div className="rounded-full bg-gcm-100 p-2 mr-3">
                        <User className="h-4 w-4 text-gcm-600" />
                      </div>
                      <div>
                        <p className="font-medium">{gcm.nome}</p>
                        <p className="text-sm text-gray-600">
                          {gcm.matricula} | {gcm.posto}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OccurrenceDetails;

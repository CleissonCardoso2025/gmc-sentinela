
import React from 'react';
import DashboardLayout from '@/layouts/Dashboard';
import { WelcomeHeader } from '@/components/Dashboard/WelcomeHeader';
import { QuickStats } from '@/components/Dashboard/QuickStats';
import { QuickActions } from '@/components/Dashboard/QuickActions';
import { AlertBoard } from '@/components/Dashboard/AlertBoard';
import { RecentOccurrences } from '@/components/Dashboard/RecentOccurrences';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Route, Clock, MapPin, User, Users } from 'lucide-react';

const Dashboard = () => {
  // Mock data for patrol route
  const patrolRouteData = {
    name: "Rota Central - Setor 2",
    locations: [
      { id: 1, name: "Praça da República", time: "09:00", status: "Completo" },
      { id: 2, name: "Mercado Municipal", time: "10:30", status: "Completo" },
      { id: 3, name: "Escola Municipal João Silva", time: "12:00", status: "Pendente" },
      { id: 4, name: "Terminal Rodoviário", time: "14:30", status: "Pendente" },
      { id: 5, name: "Parque Central", time: "16:00", status: "Pendente" }
    ],
    startTime: "08:00",
    endTime: "17:00",
    date: "08/04/2025"
  };

  // Mock data for work schedule
  const workScheduleData = [
    { id: 1, date: "08/04/2025", dayOfWeek: "Segunda", shift: "Diurno", startTime: "08:00", endTime: "20:00", role: "Patrulhamento" },
    { id: 2, date: "09/04/2025", dayOfWeek: "Terça", shift: "Diurno", startTime: "08:00", endTime: "20:00", role: "Patrulhamento" },
    { id: 3, date: "10/04/2025", dayOfWeek: "Quarta", shift: "Folga", startTime: "-", endTime: "-", role: "-" },
    { id: 4, date: "11/04/2025", dayOfWeek: "Quinta", shift: "Diurno", startTime: "08:00", endTime: "20:00", role: "Patrulhamento" },
    { id: 5, date: "12/04/2025", dayOfWeek: "Sexta", shift: "Diurno", startTime: "08:00", endTime: "20:00", role: "Patrulhamento" }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completo":
        return <Badge className="bg-green-100 text-green-800 border-green-300">Completo</Badge>;
      case "Pendente":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Pendente</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-300">{status}</Badge>;
    }
  };

  const getShiftBadge = (shift: string) => {
    switch (shift) {
      case "Diurno":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Diurno</Badge>;
      case "Noturno":
        return <Badge className="bg-purple-100 text-purple-800 border-purple-300">Noturno</Badge>;
      case "Folga":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-300">Folga</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-300">{shift}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4 sm:p-6 space-y-6 animate-fade-in">
        <WelcomeHeader userName="Carlos Silva" role="Guarda Civil Municipal" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <QuickStats />
            <QuickActions />
            
            {/* Patrol Route Section */}
            <Card className="shadow-md animate-fade-up" style={{ animationDelay: '200ms' }}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center">
                  <Route className="h-5 w-5 mr-2 text-gcm-600" />
                  Rota de Patrulhamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pb-3 border-b">
                    <div className="flex items-center mb-2 sm:mb-0">
                      <h3 className="font-medium">{patrolRouteData.name}</h3>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CalendarDays className="h-4 w-4 mr-1" />
                      <span>{patrolRouteData.date}</span>
                      <Clock className="h-4 w-4 ml-3 mr-1" />
                      <span>{patrolRouteData.startTime} - {patrolRouteData.endTime}</span>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Local</TableHead>
                          <TableHead>Horário Previsto</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {patrolRouteData.locations.map((location) => (
                          <TableRow key={location.id}>
                            <TableCell className="font-medium flex items-center">
                              <MapPin className="h-4 w-4 mr-2 text-gcm-600" />
                              {location.name}
                            </TableCell>
                            <TableCell>{location.time}</TableCell>
                            <TableCell>{getStatusBadge(location.status)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <RecentOccurrences />
          </div>
          
          <div className="md:col-span-1 space-y-6">
            <AlertBoard />
            
            {/* Work Schedule Section */}
            <Card className="shadow-md animate-fade-up" style={{ animationDelay: '300ms' }}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center">
                  <CalendarDays className="h-5 w-5 mr-2 text-gcm-600" />
                  Escala de Trabalho
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center pb-2 border-b">
                    <User className="h-4 w-4 mr-2 text-gcm-600" />
                    <span className="text-sm font-medium">Individual - Carlos Silva</span>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Data</TableHead>
                          <TableHead>Turno</TableHead>
                          <TableHead>Horário</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {workScheduleData.map((day) => (
                          <TableRow key={day.id} className="animate-fade-up" style={{ animationDelay: `${400 + day.id * 50}ms` }}>
                            <TableCell>
                              <div className="font-medium">{day.date}</div>
                              <div className="text-xs text-gray-500">{day.dayOfWeek}</div>
                            </TableCell>
                            <TableCell>{getShiftBadge(day.shift)}</TableCell>
                            <TableCell>
                              {day.shift !== "Folga" ? (
                                <div className="text-sm">
                                  {day.startTime} - {day.endTime}
                                  <div className="text-xs text-gray-500">{day.role}</div>
                                </div>
                              ) : (
                                "-"
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

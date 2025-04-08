
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, User } from 'lucide-react';
import { cn } from "@/lib/utils";

interface WorkScheduleDay {
  id: number;
  date: string;
  dayOfWeek: string;
  shift: string;
  startTime: string;
  endTime: string;
  role: string;
}

interface WorkScheduleCardProps {
  workScheduleData: WorkScheduleDay[];
  userName: string;
}

export const WorkScheduleCard: React.FC<WorkScheduleCardProps> = ({ workScheduleData, userName }) => {
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
            <span className="text-sm font-medium">Individual - {userName}</span>
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
  );
};

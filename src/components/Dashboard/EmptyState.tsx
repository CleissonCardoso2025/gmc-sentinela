
import React from 'react';
import { AlertTriangle, Search, Info, Users, Map, AlertCircle, Calendar, FileText, Car, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: 'alert' | 'search' | 'info' | 'users' | 'map' | 'error' | 'calendar' | 'file' | 'car' | 'user-x';
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Nenhum dado encontrado',
  description = 'Não há dados disponíveis para exibir no momento.',
  icon = 'info',
  actionLabel,
  onAction
}) => {
  const icons = {
    alert: <AlertTriangle className="h-12 w-12 text-yellow-500" />,
    search: <Search className="h-12 w-12 text-blue-500" />,
    info: <Info className="h-12 w-12 text-gray-500" />,
    users: <Users className="h-12 w-12 text-blue-500" />,
    map: <Map className="h-12 w-12 text-green-500" />,
    error: <AlertCircle className="h-12 w-12 text-red-500" />,
    calendar: <Calendar className="h-12 w-12 text-purple-500" />,
    file: <FileText className="h-12 w-12 text-indigo-500" />,
    car: <Car className="h-12 w-12 text-green-500" />,
    'user-x': <UserX className="h-12 w-12 text-red-500" />
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
      <div className="mb-4">
        {icons[icon]}
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-4 max-w-md">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;

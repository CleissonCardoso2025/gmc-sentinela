
import React from 'react';
import { Shield, Calendar } from 'lucide-react';

interface WelcomeHeaderProps {
  userName: string;
  role: string;
}

export const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ userName, role }) => {
  const currentDate = new Date();
  const formattedDate = new Intl.DateTimeFormat('pt-BR', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }).format(currentDate);
  
  // First letter uppercase and the rest lowercase
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  
  // Get time of day for personalized greeting
  const hours = currentDate.getHours();
  let greeting = '';
  
  if (hours >= 5 && hours < 12) {
    greeting = 'Bom dia';
  } else if (hours >= 12 && hours < 18) {
    greeting = 'Boa tarde';
  } else {
    greeting = 'Boa noite';
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gcm-600 flex items-center">
            {greeting}, <span className="text-gcm-700 ml-2">{userName}</span>
          </h1>
          <p className="text-gray-600 mt-1 flex items-center">
            <Shield className="h-4 w-4 mr-2 text-gcm-500" />
            {role}
          </p>
          <p className="text-gray-500 mt-2 flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2" />
            {capitalizedDate}
          </p>
        </div>
        
        <div className="rounded-full bg-gcm-100 p-3">
          <Shield className="h-8 w-8 text-gcm-600" />
        </div>
      </div>
    </div>
  );
};

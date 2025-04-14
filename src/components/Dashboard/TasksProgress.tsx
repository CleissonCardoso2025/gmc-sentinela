
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Task {
  id: string;
  name: string;
  progress: number;
  status: 'pending' | 'in-progress' | 'completed';
}

const TasksProgress: React.FC = () => {
  // Mock data for the tasks
  const tasks: Task[] = [
    { id: '1', name: 'Patrulhamento Centro', progress: 75, status: 'in-progress' },
    { id: '2', name: 'Operação Praça Segura', progress: 100, status: 'completed' },
    { id: '3', name: 'Ronda Escolar', progress: 30, status: 'in-progress' },
    { id: '4', name: 'Fiscalização Noturna', progress: 50, status: 'in-progress' },
    { id: '5', name: 'Apoio Eventos', progress: 10, status: 'pending' },
  ];

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div key={task.id} className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="font-medium">{task.name}</div>
            <div className="text-sm text-muted-foreground">{task.progress}%</div>
          </div>
          <Progress 
            value={task.progress} 
            className={`h-2 ${
              task.status === 'completed' 
                ? 'bg-green-100' 
                : task.status === 'in-progress' 
                  ? 'bg-blue-100' 
                  : 'bg-gray-100'
            }`}
            indicatorClassName={
              task.status === 'completed' 
                ? 'bg-green-500' 
                : task.status === 'in-progress' 
                  ? 'bg-blue-500' 
                  : 'bg-gray-500'
            }
          />
        </div>
      ))}
    </div>
  );
};

export default TasksProgress;

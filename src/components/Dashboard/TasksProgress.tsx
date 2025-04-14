
import React from 'react';
import { Progress } from "@/components/ui/progress";

interface Task {
  id: string;
  name: string;
  progress: number;
}

const TasksProgress = () => {
  const [tasks, setTasks] = React.useState<Task[]>([
    { id: '1', name: 'Patrulhamento Preventivo', progress: 75 },
    { id: '2', name: 'Fiscalização de Comércio', progress: 45 },
    { id: '3', name: 'Operação Escolas Seguras', progress: 90 },
    { id: '4', name: 'Assistência Social', progress: 30 },
    { id: '5', name: 'Controle de Trânsito', progress: 60 }
  ]);

  const getProgressColor = (progress: number) => {
    if (progress < 30) return "bg-red-500";
    if (progress < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div key={task.id} className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{task.name}</span>
            <span className="font-medium">{task.progress}%</span>
          </div>
          <Progress 
            value={task.progress} 
            className="h-2" 
            indicatorClassName={getProgressColor(task.progress)}
          />
        </div>
      ))}
    </div>
  );
};

export default TasksProgress;

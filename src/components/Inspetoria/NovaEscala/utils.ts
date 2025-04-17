
import { format, addDays } from "date-fns";
import { ScheduleEntry } from "./types";

// Function to generate dates for specified period duration
export const generateDaysFromDate = (startDate: Date, durationInDays: number) => {
  const days = [];
  for (let i = 0; i < durationInDays; i++) {
    days.push(addDays(new Date(startDate), i));
  }
  return days;
};

export const getAgentById = (guarnicoes: any[], id: string) => {
  for (const guarnicao of guarnicoes) {
    if (!guarnicao.membros) continue;
    const agent = guarnicao.membros.find((m: any) => m.id === id);
    if (agent) return agent;
  }
  return null;
};

export const getShiftColor = (shift: string) => {
  switch (shift) {
    case '24h':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'Folga':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

export const createEmptySchedule = (selectedGuarnicao: any, startDate: Date, durationInDays: number) => {
  if (!selectedGuarnicao || !selectedGuarnicao.membros) return [];
  
  const newSchedule: ScheduleEntry[] = [];
  const days = generateDaysFromDate(startDate, durationInDays);
  
  selectedGuarnicao.membros.forEach((membro: any) => {
    days.forEach(day => {
      newSchedule.push({
        date: new Date(day),
        agentId: membro.id,
        shift: "Folga",
        supervisor: membro.funcao === "Supervisor"
      });
    });
  });
  
  return newSchedule;
};

export const generateSortedSchedule = (
  scheduleData: ScheduleEntry[], 
  selectedGuarnicao: any, 
  startDate: Date,
  durationInDays: number
) => {
  console.log("Generating sorted schedule with parameters:", {
    scheduleDataLength: scheduleData.length,
    selectedGuarnicao,
    startDate: startDate.toISOString(),
    durationInDays
  });

  if (!selectedGuarnicao || !selectedGuarnicao.membros) {
    console.log("No selected guarnicao or no members, returning original schedule");
    return scheduleData;
  }

  const newSchedule = [...scheduleData];
  const days = generateDaysFromDate(startDate, durationInDays);
  const agents = selectedGuarnicao.membros;
  
  console.log(`Found ${agents.length} agents to schedule`);
  
  // Reset all to folga first
  newSchedule.forEach(entry => {
    entry.shift = "Folga";
  });
  
  // For each agent, start assigning 24h shifts with 72h gaps
  agents.forEach((agent: any, agentIndex: number) => {
    // Each agent starts at a different day (offset by agentIndex)
    const startOffset = agentIndex % 4;
    
    console.log(`Agent ${agent.nome} (index ${agentIndex}) starts at offset ${startOffset}`);
    
    for (let i = startOffset; i < durationInDays; i += 4) {
      const day = days[i];
      
      console.log(`Assigning 24h shift for ${agent.nome} on ${format(day, 'yyyy-MM-dd')}`);
      
      // Find entries for this agent and day
      newSchedule.forEach(entry => {
        const entryDate = new Date(entry.date);
        
        if (entry.agentId === agent.id && 
            entryDate.getDate() === day.getDate() &&
            entryDate.getMonth() === day.getMonth() &&
            entryDate.getFullYear() === day.getFullYear()) {
          entry.shift = "24h";
          console.log(`Successfully assigned shift for ${agent.id} on ${entryDate.toISOString()}`);
        }
      });
    }
  });
  
  console.log(`Generated schedule with ${newSchedule.length} entries`);
  return newSchedule;
};

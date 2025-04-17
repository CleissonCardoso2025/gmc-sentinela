
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DateRangeType } from "@/hooks/use-occurrence-data";
import EmptyState from '@/components/Dashboard/EmptyState';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface ChartProps {
  date: DateRangeType;
}

const Chart: React.FC<ChartProps> = ({ date }) => {
  const [data, setData] = useState<{ name: string; quantidade: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOccurrenceData = async () => {
      setIsLoading(true);
      try {
        const fromDate = format(date.from, 'yyyy-MM-dd');
        const toDate = format(date.to, 'yyyy-MM-dd');
        
        const { data: occurrences, error } = await supabase
          .from('ocorrencias')
          .select('tipo, id')
          .gte('created_at', `${fromDate}T00:00:00`)
          .lte('created_at', `${toDate}T23:59:59`);
        
        if (error) throw error;
        
        // Process occurrences by type for chart
        const occurrenceTypes = {};
        occurrences?.forEach(occurrence => {
          const tipo = occurrence.tipo;
          occurrenceTypes[tipo] = (occurrenceTypes[tipo] || 0) + 1;
        });
        
        const chartData = Object.keys(occurrenceTypes).map(type => ({
          name: type,
          quantidade: occurrenceTypes[type]
        }));
        
        setData(chartData);
      } catch (error) {
        console.error('Error fetching occurrence data for chart:', error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOccurrenceData();
  }, [date]);

  if (isLoading) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <div className="animate-pulse bg-gray-200 h-[250px] w-full rounded" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <EmptyState
          title="Sem dados"
          description="Não há dados para exibir no gráfico"
          icon="info"
        />
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 0,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="quantidade" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Chart;

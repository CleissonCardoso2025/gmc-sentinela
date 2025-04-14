
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DateRangeType } from "@/hooks/use-occurrence-data";
import EmptyState from '@/components/Dashboard/EmptyState';

interface ChartProps {
  date: DateRangeType;
}

const Chart: React.FC<ChartProps> = ({ date }) => {
  // Dados demonstrativos vazios
  const data: { name: string; quantidade: number }[] = [];

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

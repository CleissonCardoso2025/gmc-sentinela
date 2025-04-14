
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DateRange } from "@/components/ui/date-range-picker";

interface ChartProps {
  date: DateRange;
}

const Chart: React.FC<ChartProps> = ({ date }) => {
  // Mock data for the chart
  const data = [
    { name: 'Desordem', quantidade: 12 },
    { name: 'Furto', quantidade: 8 },
    { name: 'Barulho', quantidade: 20 },
    { name: 'Assistência', quantidade: 15 },
    { name: 'Vandalismo', quantidade: 6 },
    { name: 'Trânsito', quantidade: 25 },
  ];

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

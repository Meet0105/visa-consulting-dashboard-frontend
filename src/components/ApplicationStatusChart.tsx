import React from 'react';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';

interface ApplicationStatusChartProps {
  pieData: { name: string; value: number; color: string }[];
  title: string;
  subtitle: string;
}

const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

const ApplicationStatusChart: React.FC<ApplicationStatusChartProps> = ({
  pieData,
  title,
  subtitle,
}) => {
  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">{title}</h2>
        <p className="card-subtitle">{subtitle}</p>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ApplicationStatusChart;
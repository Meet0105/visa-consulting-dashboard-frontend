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
        <h2 className="card-title text-lg sm:text-xl">{title}</h2>
        <p className="card-subtitle text-xs sm:text-sm">{subtitle}</p>
      </div>
      <div className="h-64 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius="60%"
              fill="#8884d8"
              label={(entry) => `${entry.name}: ${entry.value}`}
              labelLine={false}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '8px 12px'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-3 justify-center">
        {pieData.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color || COLORS[index % COLORS.length] }}
            />
            <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              {entry.name}: <span className="font-semibold text-gray-900 dark:text-gray-100">{entry.value}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicationStatusChart;
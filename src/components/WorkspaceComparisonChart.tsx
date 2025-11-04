import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface WorkspaceComparisonChartProps {
  workspaceData: { name: string; users: number; applications: number }[];
  title: string;
  subtitle: string;
}

const WorkspaceComparisonChart: React.FC<WorkspaceComparisonChartProps> = ({
  workspaceData,
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
          <BarChart data={workspaceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="users" fill="#8884d8" name="Users" />
            <Bar dataKey="applications" fill="#82ca9d" name="Applications" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WorkspaceComparisonChart;
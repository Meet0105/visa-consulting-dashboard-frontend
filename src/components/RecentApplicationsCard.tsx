import React from 'react';
import { UserAnalyticsSummary } from '@/types/types';

interface RecentApplicationsCardProps {
  summary: UserAnalyticsSummary | undefined;
  isLoading: boolean;
}

export const RecentApplicationsCard: React.FC<RecentApplicationsCardProps> = ({ summary, isLoading }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <span className="badge badge-success">Approved</span>;
      case "PENDING":
        return <span className="badge badge-warning">Pending</span>;
      case "REJECTED":
        return <span className="badge badge-danger">Rejected</span>;
      default:
        return <span className="badge badge-gray">{status}</span>;
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Recent Applications</h2>
        <p className="card-subtitle">Your latest visa applications</p>
      </div>
      
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="skeleton h-4 w-24 mb-2"></div>
              <div className="skeleton h-3 w-32 mb-2"></div>
              <div className="skeleton h-3 w-20"></div>
            </div>
          ))}
        </div>
      ) : summary?.applications.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No applications yet</h3>
          <p className="text-gray-500 dark:text-gray-400">You haven't submitted any visa applications yet.</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-80 overflow-y-auto custom-scrollbar">
          {summary?.applications.slice(0, 5).map(app => (
            <div key={app.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                  Application #{app.id}
                </h4>
                {getStatusBadge(app.status)}
              </div>
              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <p><span className="font-medium">Workspace:</span> {app.workspace}</p>
                <p><span className="font-medium">Submitted:</span> {new Date(app.createdAt).toLocaleDateString()}</p>
                {app.assignedManager && (
                  <p><span className="font-medium">Manager:</span> {app.assignedManager.name}</p>
                )}
                {app.status !== "PENDING" && (
                  <p><span className="font-medium">Updated:</span> {new Date(app.updatedAt).toLocaleDateString()}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
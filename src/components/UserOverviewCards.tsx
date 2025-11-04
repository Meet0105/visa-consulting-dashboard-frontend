import React from 'react';
import { UserAnalyticsSummary } from '@/types/types';

interface UserOverviewCardsProps {
  summary: UserAnalyticsSummary['summary'] | undefined;
  isLoading: boolean;
}

export const UserOverviewCards: React.FC<UserOverviewCardsProps> = ({
  summary,
  isLoading,
}) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Applications</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {isLoading ? <span className="skeleton w-16 h-8"></span> : summary?.total ?? "-"}
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Approved Applications</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {isLoading ? <span className="skeleton w-16 h-8"></span> : summary?.approved ?? "-"}
            </p>
          </div>
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Applications</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {isLoading ? <span className="skeleton w-16 h-8"></span> : summary?.pending ?? "-"}
            </p>
          </div>
          <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Success Rate</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {isLoading ? <span className="skeleton w-16 h-8"></span> : summary?.successRate ?? "-"}
            </p>
          </div>
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
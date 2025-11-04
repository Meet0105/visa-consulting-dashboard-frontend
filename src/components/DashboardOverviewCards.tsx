import React from 'react';
import { AdminAnalytics, ManagerAnalytics } from '@/types/types';

interface DashboardOverviewCardsProps {
  analytics: AdminAnalytics | ManagerAnalytics | undefined;
  isLoading: boolean;
}

const DashboardOverviewCards: React.FC<DashboardOverviewCardsProps> = ({
  analytics,
  isLoading,
}) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{ (analytics as AdminAnalytics)?.overview.users !== undefined ? "Total Users" : "Total Applications" }</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {isLoading ? <span className="skeleton w-16 h-8"></span> : ( (analytics as AdminAnalytics)?.overview.users !== undefined ? (analytics as AdminAnalytics)?.overview.users : analytics?.overview.appsTotal ) ?? "-"}
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{ (analytics as AdminAnalytics)?.overview.managers !== undefined ? "Total Managers" : "Approved Applications" }</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {isLoading ? <span className="skeleton w-16 h-8"></span> : ( (analytics as AdminAnalytics)?.overview.managers !== undefined ? (analytics as AdminAnalytics)?.overview.managers : analytics?.overview.approved ) ?? "-"}
            </p>
          </div>
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Applications</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {isLoading ? <span className="skeleton w-16 h-8"></span> : analytics?.overview.pending ?? "-"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {analytics?.overview.rejectionRate} rejected
            </p>
          </div>
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Recent Activity</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {isLoading ? <span className="skeleton w-16 h-8"></span> : analytics?.recentActivity.newApplications ?? "-"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              { (analytics as AdminAnalytics)?.overview.users !== undefined ? `New applications (${(analytics as AdminAnalytics)?.recentActivity.period})` : `My assigned applications: ${(analytics as ManagerAnalytics)?.recentActivity.myAssignedApplications ?? "-"}` }
            </p>
          </div>
          <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverviewCards;
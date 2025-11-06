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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <div className="stat-card group">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider truncate mb-2">
              { (analytics as AdminAnalytics)?.overview.users !== undefined ? "Total Users" : "Total Applications" }
            </p>
            <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {isLoading ? <span className="shimmer w-16 h-10 rounded"></span> : ( (analytics as AdminAnalytics)?.overview.users !== undefined ? (analytics as AdminAnalytics)?.overview.users : analytics?.overview.appsTotal ) ?? "-"}
            </p>
          </div>
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center flex-shrink-0 ml-3 shadow-lg shadow-indigo-500/50 group-hover:scale-110 transition-transform duration-300">
            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="stat-card group">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider truncate mb-2">
              { (analytics as AdminAnalytics)?.overview.managers !== undefined ? "Total Managers" : "Approved" }
            </p>
            <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {isLoading ? <span className="shimmer w-16 h-10 rounded"></span> : ( (analytics as AdminAnalytics)?.overview.managers !== undefined ? (analytics as AdminAnalytics)?.overview.managers : analytics?.overview.approved ) ?? "-"}
            </p>
          </div>
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center flex-shrink-0 ml-3 shadow-lg shadow-green-500/50 group-hover:scale-110 transition-transform duration-300">
            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="stat-card group">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider truncate mb-2">Pending</p>
            <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              {isLoading ? <span className="shimmer w-16 h-10 rounded"></span> : analytics?.overview.pending ?? "-"}
            </p>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-2 truncate">
              {analytics?.overview.rejectionRate} rejected
            </p>
          </div>
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center flex-shrink-0 ml-3 shadow-lg shadow-yellow-500/50 group-hover:scale-110 transition-transform duration-300">
            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="stat-card group">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider truncate mb-2">Recent Activity</p>
            <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {isLoading ? <span className="shimmer w-16 h-10 rounded"></span> : analytics?.recentActivity.newApplications ?? "-"}
            </p>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-2 truncate">
              { (analytics as AdminAnalytics)?.overview.users !== undefined ? `New (${(analytics as AdminAnalytics)?.recentActivity.period})` : `Assigned: ${(analytics as ManagerAnalytics)?.recentActivity.myAssignedApplications ?? "-"}` }
            </p>
          </div>
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center flex-shrink-0 ml-3 shadow-lg shadow-blue-500/50 group-hover:scale-110 transition-transform duration-300">
            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverviewCards;
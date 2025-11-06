"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import DashboardLayout from "@/components/DashboardLayout";
import DashboardHeader from "@/components/DashboardHeader";
import DashboardOverviewCards from "@/components/DashboardOverviewCards";
import ApplicationStatusChart from "@/components/ApplicationStatusChart";
import WorkspaceComparisonChart from "@/components/WorkspaceComparisonChart";
import UserTable from "@/components/UserTable";
import { useAdminAnalytics, useWorkspaces, useAdminUsers, useDashboardLoading, transformToPieData, transformWorkspaceData } from "@/hooks/useDashboardData";

export default function AdminDashboard() {
  const [workspaceId, setWorkspaceId] = useState<string | undefined>(undefined);
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const router = useRouter();

  const { data: workspaces = [], isLoading: isLoadingWorkspaces } = useWorkspaces();
  const { data: analytics, isLoading: isLoadingAnalytics } = useAdminAnalytics(workspaceId);
  const { data: users = [], isLoading: isLoadingUsers } = useAdminUsers(workspaceId, roleFilter, searchTerm);

  const isLoading = useDashboardLoading(
    { isLoading: isLoadingWorkspaces },
    { isLoading: isLoadingAnalytics },
    { isLoading: isLoadingUsers }
  );

  const pieData = transformToPieData(analytics?.overview);
  const workspaceData = transformWorkspaceData(analytics?.workspaceBreakdown);
  return (
    <AuthGuard requiredRole="ADMIN">
      <DashboardLayout>
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="container-wide py-4 sm:py-6 lg:py-8">
          {/* Header */}
          <DashboardHeader
            title="Admin Dashboard"
            subtitle="System overview and management"
            onLogout={() => {
              localStorage.removeItem('token');
              router.push('/login');
            }}
          />

          {/* Filters */}
          <div className="card mb-6 sm:mb-8">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Filters</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="label">Workspace Filter</label>
                <select
                  className="select"
                  value={workspaceId ?? ""}
                  onChange={e => setWorkspaceId(e.target.value || undefined)}
                >
                  <option value="">All Workspaces</option>
                  {workspaces.map(w => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Role Filter</label>
                <select
                  className="select"
                  value={roleFilter}
                  onChange={e => setRoleFilter(e.target.value)}
                >
                  <option value="">All Roles</option>
                  <option value="MANAGER">Managers</option>
                  <option value="USER">Users</option>
                </select>
              </div>
              <div className="sm:col-span-2 lg:col-span-1">
                <label className="label">Search Users</label>
                <div className="relative">
                  <input
                    className="input pl-10"
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                  <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Analytics Overview */}
          <DashboardOverviewCards
            analytics={analytics}
            isLoading={isLoadingAnalytics}
          />

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
            {/* Application Status Chart */}
            <ApplicationStatusChart
              pieData={pieData}
              title="Application Status Distribution"
              subtitle="Overview of application statuses"
            />

            {/* Workspace Comparison */}
            <WorkspaceComparisonChart
              workspaceData={workspaceData}
              title="Workspace Overview"
              subtitle="Users and applications by workspace"
            />
          </div>

          {/* Users Table */}
          <UserTable
            users={users}
            isLoading={isLoading}
          />
          </div>
        </main>
      </DashboardLayout>
    </AuthGuard>
  );
}
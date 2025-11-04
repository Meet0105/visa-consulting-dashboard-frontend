"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
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
    <AuthGuard>
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container-wide py-8">
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
          <div className="card mb-8">
            <div className="grid md:grid-cols-3 gap-4">
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
              <div>
                <label className="label">Search Users</label>
                <input
                  className="input"
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Analytics Overview */}
          <DashboardOverviewCards
            analytics={analytics}
            isLoading={isLoadingAnalytics}
          />

          {/* Charts Section */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
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
    </AuthGuard>
  );
}
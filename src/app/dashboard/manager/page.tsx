"use client";
import UserTable from "@/components/UserTable";
import ApplicationStatusChart from "@/components/ApplicationStatusChart";
import DashboardOverviewCards from "@/components/DashboardOverviewCards";
import DashboardHeader from "@/components/DashboardHeader";
import { useRouter } from "next/navigation";
import { useManagerAnalytics, useManagerUsers, useDashboardLoading,transformToPieData } from "@/hooks/useDashboardData";

export default function ManagerDashboard() {
  const router = useRouter();
  const { data: analytics, isLoading: isLoadingAnalytics } = useManagerAnalytics();
  const { data: users = [], isLoading: isLoadingUsers } = useManagerUsers();
  
  const isLoading = useDashboardLoading(
    { isLoading: isLoadingAnalytics },
    { isLoading: isLoadingUsers }
  );

  const pieData = transformToPieData(analytics?.overview);
  
  const monthlyData = analytics?.statusBreakdown
    ? [
        {
          name: "Approved",
          applications: analytics.statusBreakdown.approved ?? 0,
        },
        {
          name: "Pending",
          applications: analytics.statusBreakdown.pending ?? 0,
        },
        {
          name: "Rejected",
          applications: analytics.statusBreakdown.rejected ?? 0,
        },
      ]
    : [];

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container-wide py-8">
        {/* Header */}
        <DashboardHeader
          title="Manager Dashboard"
          subtitle="Workspace management and team oversight"
          onLogout={async () => {
            try {
              // Logout is handled by clearing token and redirecting
              localStorage.removeItem('token');
              router.push("/login");
            } catch (err) {
              console.warn("Logout failed:", err);
              router.push("/login");
            }
          }}
        />

        {/* Analytics Overview */}
        <DashboardOverviewCards
            analytics={analytics}
            isLoading={isLoadingAnalytics}
          />

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Application Status Chart */}
          <ApplicationStatusChart 
            title="Application Status Overview"
            subtitle="Current distribution of application statuses"
            pieData={pieData}
          />
          
          {/* Monthly Applications */}
          <ApplicationStatusChart
            title="Monthly Application Status Breakdown"
            subtitle="Overview of application statuses over time"
            pieData={monthlyData.map(item => ({
              name: item.name,
              value: item.applications,
              color: item.name === "Approved" ? "#10b981" : item.name === "Pending" ? "#f59e0b" : "#ef4444"
            }))}
          />
        </div>

        {/* Users Table */}
        <UserTable users={users.map(user => ({
          ...user,
          role: user.role as "ADMIN" | "MANAGER" | "USER",
          _count: user._count || { applications: 0 }
        }))} isLoading={isLoadingUsers} />

        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Recent Activity</h3>
              <p className="card-subtitle">Latest updates in your workspace</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {analytics?.recentActivity.newApplications || 0} new applications received
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">In the last 30 days</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {analytics?.recentActivity.myAssignedApplications || 0} applications assigned to you
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Requires your review</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Performance Summary</h3>
              <p className="card-subtitle">Your workspace metrics</p>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Approval Rate</span>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  {analytics?.overview.approvalRate || "0%"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Rejection Rate</span>
                <span className="text-sm font-medium text-red-600 dark:text-red-400">
                  {analytics?.overview.rejectionRate || "0%"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Pending Review</span>
                <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                  {analytics?.overview.pending || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
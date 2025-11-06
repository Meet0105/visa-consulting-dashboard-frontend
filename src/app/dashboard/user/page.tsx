"use client";
import AuthGuard from "@/components/AuthGuard";
import DashboardLayout from "@/components/DashboardLayout";
import ApplicationStatusChart from "@/components/ApplicationStatusChart";
import { UserOverviewCards } from "@/components/UserOverviewCards";
import DashboardHeader from "@/components/DashboardHeader";
import { UserProfileCard } from "@/components/UserProfileCard";
import { RecentApplicationsCard } from "@/components/RecentApplicationsCard";
import { UserQuickActions } from "@/components/UserQuickActions";
import { useRouter } from "next/navigation";
import { useUserProfile, useUserAnalytics, useDashboardLoading,transformToPieData } from "@/hooks/useDashboardData";

export default function UserDashboard() {
  const router = useRouter();

  const { data: me, isLoading: isLoadingMe } = useUserProfile();
  const { data: summary, isLoading: isLoadingSummary } = useUserAnalytics();
  
  const isLoading = useDashboardLoading(
    { isLoading: isLoadingMe },
    { isLoading: isLoadingSummary }
  );

  const pieData = transformToPieData(summary?.summary);

  return (
    <AuthGuard requiredRole="USER">
      <DashboardLayout>
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="container-wide py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <DashboardHeader
          title="User Dashboard"
          subtitle="Your personal overview and application tracking"
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

        {/* User Profile */}
        <UserProfileCard me={me} isLoadingMe={isLoadingMe} />

        {/* Application Summary */}
        <UserOverviewCards
            isLoading={isLoadingSummary}
            summary={summary?.summary}
           />

        {/* Charts and Applications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Application Status Chart */}
          <ApplicationStatusChart
            pieData={pieData}
            title="Application Status"
            subtitle="Overview of your application statuses"
          />

          {/* Recent Applications */}
          <RecentApplicationsCard summary={summary} isLoading={isLoading} />
        </div>

        {/* Quick Actions */}
        <UserQuickActions />
          </div>
        </main>
      </DashboardLayout>
    </AuthGuard>
  );
}

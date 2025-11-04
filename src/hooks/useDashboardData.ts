import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { 
  AdminAnalytics, 
  ManagerAnalytics, 
  UserAnalyticsSummary, 
  Workspace, 
  UserRow, 
  ManagerUser, 
  UserProfile 
} from "@/types/types";

// Admin dashboard hooks
export const useAdminAnalytics = (workspaceId?: string) => {
  return useQuery<AdminAnalytics>({
    queryKey: ["adminAnalytics", workspaceId],
    queryFn: async () => {
      const response = await api.get("/analytics", { 
        params: { workspaceId: workspaceId || "" } 
      });
      return response.data;
    },
    enabled: true,
  });
};

export const useWorkspaces = () => {
  return useQuery<Workspace[]>({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const response = await api.get("/workspaces");
      return response.data;
    },
  });
};

export const useAdminUsers = (workspaceId?: string, roleFilter?: string, searchTerm?: string) => {
  return useQuery<UserRow[]>({
    queryKey: ["adminUsers", workspaceId, roleFilter, searchTerm],
    queryFn: async () => {
      const response = await api.get("/users", { 
        params: { 
          workspaceId: workspaceId || "", 
          role: roleFilter || undefined, 
          search: searchTerm || undefined 
        } 
      });
      return response.data.users || [];
    },
  });
};

// Manager dashboard hooks
export const useManagerAnalytics = () => {
  return useQuery<ManagerAnalytics>({
    queryKey: ["managerAnalytics"],
    queryFn: async () => {
      const response = await api.get("/analytics/mine");
      return response.data;
    },
  });
};

export const useManagerUsers = () => {
  return useQuery<ManagerUser[]>({
    queryKey: ["managerUsers"],
    queryFn: async () => {
      const response = await api.get("/users/workspace/mine");
      return response.data;
    },
  });
};

// User dashboard hooks
export const useUserProfile = () => {
  return useQuery<UserProfile>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const response = await api.get("/users/me");
      return response.data;
    },
  });
};

export const useUserAnalytics = () => {
  return useQuery<UserAnalyticsSummary>({
    queryKey: ["userAnalytics"],
    queryFn: async () => {
      const response = await api.get("/analytics/me");
      return response.data;
    },
  });
};

// Common utilities
export const useDashboardLoading = (...queries: { isLoading: boolean }[]) => {
  return queries.some(query => query.isLoading);
};

// Data transformation utilities
export const transformToPieData = (analytics: { approved: number; pending: number; rejected: number } | null | undefined) => {
  if (!analytics) return [];
  
  return [
    { name: "Approved", value: analytics.approved || 0, color: "#10b981" },
    { name: "Pending", value: analytics.pending || 0, color: "#f59e0b" },
    { name: "Rejected", value: analytics.rejected || 0, color: "#ef4444" },
  ];
};

export const transformWorkspaceData = (workspaceBreakdown: Workspace[] | null | undefined) => {
  if (!workspaceBreakdown) return [];
  
  return workspaceBreakdown.map(ws => ({
    name: ws.name,
    users: ws._count?.users || 0,
    applications: ws._count?.applications || 0,
  }));
};

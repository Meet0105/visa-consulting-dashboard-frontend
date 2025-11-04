export type JwtUser = {
  id: string;
  role: "ADMIN" | "MANAGER" | "USER";
  workspaceId?: string | null;
  email: string;
  iat: number;
  exp: number;
};

export type Workspace = {
  id: string; 
  name: string; 
  _count?: { 
    users: number; 
    applications: number 
  } 
};

export type AdminAnalytics = { 
  overview: { 
    users: number; 
    managers: number; 
    appsTotal: number; 
    approved: number; 
    rejected: number; 
    pending: number;
    approvalRate: string;
    rejectionRate: string;
  };
  recentActivity: { period: string; newApplications: number };
  statusBreakdown: any;
  workspaceBreakdown: Workspace[];
};

export type ManagerAnalytics = {
  overview: {
    appsTotal: number;
    approved: number;
    rejected: number;
    pending: number;
    approvalRate: string;
    rejectionRate: string;
  };
  recentActivity: {
    newApplications: number;
    myAssignedApplications: number;
  };
  statusBreakdown: any;
};

export type UserAnalyticsSummary = {
  summary: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
    successRate: string;
  };
  recentActivity: {
    newApplications: number;
  };
  applications: Array<{
    id: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    createdAt: string;
    updatedAt: string;
    workspace: string;
    assignedManager: {
      name: string;
      email: string;
    } | null;
  }>;
};

export type UserRow = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN"|"MANAGER"|"USER";
  workspaceId: string|null;
  workspace?: { id: string; name: string };
  createdAt: string;
  _count: {
    applications: number;
  };
};

export type ManagerUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  workspaceId: string;
  createdAt: string;
  _count: {
    applications: number;
  };
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: string;
  workspaceId: string|null;
  workspace?: {
    id: string;
    name: string;
  };
  createdAt: string;
};
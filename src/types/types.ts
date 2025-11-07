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

export type DocumentType =
  | "PASSPORT"
  | "PHOTO"
  | "BANK_STATEMENT"
  | "EMPLOYMENT_LETTER"
  | "TRAVEL_ITINERARY"
  | "ACCOMMODATION_PROOF"
  | "INSURANCE"
  | "BIRTH_CERTIFICATE"
  | "MARRIAGE_CERTIFICATE"
  | "POLICE_CLEARANCE"
  | "MEDICAL_REPORT"
  | "OTHER";

export type DocumentStatus = "PENDING_REVIEW" | "APPROVED" | "REJECTED" | "EXPIRED";

export type Document = {
  id: string;
  filename: string;
  originalFilename: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  documentType: DocumentType;
  status: DocumentStatus;
  userId: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  applicationId?: string | null;
  application?: {
    id: string;
    applicationId: string;
    status: string;
  };
  workspaceId: string;
  workspace?: {
    id: string;
    name: string;
  };
  verifiedBy?: string | null;
  verifiedAt?: string | null;
  rejectionReason?: string | null;
  expiryDate?: string | null;
  reminderSent: boolean;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
};


export type AppointmentStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "RESCHEDULED";

export type MeetingType = "IN_PERSON" | "VIDEO_CALL" | "PHONE";

export type Appointment = {
  id: string;
  studentId: string;
  student?: {
    id: string;
    name: string;
    email: string;
    phoneNumber?: string;
  };
  counselorId: string;
  counselor?: {
    id: string;
    name: string;
    email: string;
    phoneNumber?: string;
  };
  workspaceId: string;
  workspace?: {
    id: string;
    name: string;
  };
  appointmentDate: string;
  startTime: string;
  endTime: string;
  duration: number;
  status: AppointmentStatus;
  purpose: string;
  notes?: string;
  counselorNotes?: string;
  meetingType: MeetingType;
  meetingLink?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
};

export type Counselor = {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
};

export type ApplicationStatus =
  | "PENDING_REVIEW"
  | "ASSIGNED_TO_COUNSELOR"
  | "DOCUMENTS_PENDING"
  | "DOCUMENTS_VERIFIED"
  | "SUBMITTED_TO_EMBASSY"
  | "APPROVED"
  | "REJECTED"
  | "CLOSED";

export type Application = {
  id: string;
  userId: string;
  user?: {
    id: string;
    name: string;
    email: string;
    phoneNumber?: string;
    dateOfBirth?: string;
    nationality?: string;
    passportNumber?: string;
    address?: string;
  };
  workspaceId: string;
  workspace?: {
    id: string;
    name: string;
  };
  status: ApplicationStatus;
  assignedManagerId?: string | null;
  assignedManager?: {
    id: string;
    name: string;
    email: string;
    phoneNumber?: string;
  } | null;
  serviceType: string;
  preferredCountry: string;
  university?: string | null;
  program?: string | null;
  intendedStartDate?: string | null;
  visaType?: string | null;
  destinationCountry?: string | null;
  purposeOfVisit?: string | null;
  intendedDuration?: number | null;
  previousVisits?: number | null;
  hasCriminalRecord: boolean;
  hasHealthIssues: boolean;
  processingFee?: number | null;
  priority?: string | null;
  documentsSubmitted?: number | null;
  interviewRequired: boolean;
  biometricsRequired: boolean;
  estimatedProcessingTime?: number | null;
  applicationId?: string | null;
  counselorNotes?: string | null;
  adminNotes?: string | null;
  rejectionReason?: string | null;
  approvalDate?: string | null;
  submissionDate?: string | null;
  documents?: Document[];
  statusHistory?: ApplicationStatusHistory[];
  _count?: {
    documents: number;
  };
  createdAt: string;
  updatedAt: string;
};

export type ApplicationStatusHistory = {
  id: string;
  applicationId: string;
  previousStatus?: ApplicationStatus | null;
  newStatus: ApplicationStatus;
  changedBy: string;
  changedByName: string;
  changedByRole: string;
  notes?: string | null;
  createdAt: string;
};

export type ApplicationStats = {
  total: number;
  byStatus: {
    pendingReview: number;
    assigned: number;
    documentsPending: number;
    documentsVerified: number;
    submittedToEmbassy: number;
    approved: number;
    rejected: number;
  };
  byCountry: Array<{
    country: string;
    count: number;
  }>;
};


export type NotificationType = "APPLICATION" | "DOCUMENT" | "APPOINTMENT" | "CLASS" | "SYSTEM";

export type Notification = {
  id: string;
  recipientId: string;
  recipient?: {
    id: string;
    name: string;
    email: string;
  };
  senderId?: string | null;
  sender?: {
    id: string;
    name: string;
  } | null;
  message: string;
  type: NotificationType;
  link?: string | null;
  isRead: boolean;
  readAt?: string | null;
  applicationId?: string | null;
  documentId?: string | null;
  appointmentId?: string | null;
  classId?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type NotificationPreference = {
  id: string;
  userId: string;
  emailApplications: boolean;
  emailDocuments: boolean;
  emailAppointments: boolean;
  emailClasses: boolean;
  emailSystem: boolean;
  appointmentReminders: boolean;
  classReminders: boolean;
  createdAt: string;
  updatedAt: string;
};

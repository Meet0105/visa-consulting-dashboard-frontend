"use client";
import { useState } from "react";
import { Appointment, AppointmentStatus } from "@/types/types";
import { api } from "@/lib/api";

interface AppointmentsListProps {
  appointments: Appointment[];
  isLoading: boolean;
  onRefresh?: () => void;
  userRole: "ADMIN" | "MANAGER" | "USER";
}

export default function AppointmentsList({
  appointments,
  isLoading,
  onRefresh,
  userRole,
}: AppointmentsListProps) {
  const [updating, setUpdating] = useState<string | null>(null);

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case "CONFIRMED":
        return "badge-success-pro";
      case "COMPLETED":
        return "badge-info-pro";
      case "CANCELLED":
        return "badge-danger-pro";
      case "RESCHEDULED":
        return "badge-warning-pro";
      case "PENDING":
      default:
        return "badge-warning-pro";
    }
  };

  const getStatusIcon = (status: AppointmentStatus) => {
    switch (status) {
      case "CONFIRMED":
        return (
          <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "COMPLETED":
        return (
          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case "CANCELLED":
        return (
          <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleCancel = async (appointmentId: string) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    setUpdating(appointmentId);
    try {
      await api.patch(`/appointments/${appointmentId}/cancel`);
      if (onRefresh) {
        onRefresh();
      }
    } catch (error: any) {
      alert(error.response?.data?.error || "Failed to cancel appointment");
    } finally {
      setUpdating(null);
    }
  };

  const handleUpdateStatus = async (appointmentId: string, status: AppointmentStatus) => {
    setUpdating(appointmentId);
    try {
      await api.patch(`/appointments/${appointmentId}/status`, { status });
      if (onRefresh) {
        onRefresh();
      }
    } catch (error: any) {
      alert(error.response?.data?.error || "Failed to update appointment");
    } finally {
      setUpdating(null);
    }
  };

  if (isLoading) {
    return (
      <div className="glass-card p-12">
        <div className="text-center">
          <div className="spinner w-12 h-12 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading appointments...</p>
        </div>
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="glass-card p-12">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 flex items-center justify-center">
            <svg className="w-10 h-10 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No appointments found</p>
          <p className="text-gray-600 dark:text-gray-400">Book your first appointment to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <div key={appointment.id} className="glass-card p-6 hover:shadow-pro-lg transition-all duration-300">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Left Section */}
            <div className="flex items-start gap-4 flex-1">
              {getStatusIcon(appointment.status)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {appointment.purpose}
                  </h4>
                  <span className={getStatusBadge(appointment.status)}>
                    {appointment.status}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="font-medium">{formatDate(appointment.appointmentDate)}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>
                      {appointment.startTime} - {appointment.endTime} ({appointment.duration} min)
                    </span>
                  </div>

                  {userRole === "USER" && appointment.counselor && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Counselor: <span className="font-medium text-gray-900 dark:text-gray-100">{appointment.counselor.name}</span></span>
                    </div>
                  )}

                  {(userRole === "MANAGER" || userRole === "ADMIN") && appointment.student && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Student: <span className="font-medium text-gray-900 dark:text-gray-100">{appointment.student.name}</span></span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{appointment.meetingType.replace("_", " ")}</span>
                    {appointment.location && <span className="text-gray-500">• {appointment.location}</span>}
                  </div>
                </div>

                {appointment.notes && (
                  <div className="mt-3 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-semibold">Notes:</span> {appointment.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Section - Actions */}
            <div className="flex flex-wrap gap-2">
              {userRole === "USER" && appointment.status === "PENDING" && (
                <button
                  onClick={() => handleCancel(appointment.id)}
                  disabled={updating === appointment.id}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 transition-all duration-300 font-semibold text-sm shadow-lg shadow-red-500/50 disabled:opacity-50"
                >
                  Cancel
                </button>
              )}

              {(userRole === "MANAGER" || userRole === "ADMIN") && appointment.status === "PENDING" && (
                <>
                  <button
                    onClick={() => handleUpdateStatus(appointment.id, "CONFIRMED")}
                    disabled={updating === appointment.id}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-semibold text-sm shadow-lg shadow-green-500/50 disabled:opacity-50"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(appointment.id, "CANCELLED")}
                    disabled={updating === appointment.id}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 transition-all duration-300 font-semibold text-sm shadow-lg shadow-red-500/50 disabled:opacity-50"
                  >
                    Reject
                  </button>
                </>
              )}

              {(userRole === "MANAGER" || userRole === "ADMIN") && appointment.status === "CONFIRMED" && (
                <button
                  onClick={() => handleUpdateStatus(appointment.id, "COMPLETED")}
                  disabled={updating === appointment.id}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 font-semibold text-sm shadow-lg shadow-blue-500/50 disabled:opacity-50"
                >
                  Mark Complete
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

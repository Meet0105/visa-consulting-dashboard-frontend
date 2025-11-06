"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import DashboardLayout from "@/components/DashboardLayout";
import DashboardHeader from "@/components/DashboardHeader";
import AppointmentBooking from "@/components/AppointmentBooking";
import AppointmentsList from "@/components/AppointmentsList";
import { api } from "@/lib/api";
import { Appointment } from "@/types/types";

export default function AppointmentsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [showBooking, setShowBooking] = useState(false);
  const [userRole, setUserRole] = useState<"ADMIN" | "MANAGER" | "USER">("USER");

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setUserRole(user.role);
    }
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      const userStr = localStorage.getItem("user");
      if (!userStr) return;

      const user = JSON.parse(userStr);
      let endpoint = "/appointments/my";

      if (user.role === "MANAGER") {
        endpoint = "/appointments/counselor/my";
      } else if (user.role === "ADMIN") {
        endpoint = "/appointments";
      }

      const { data } = await api.get(endpoint);
      setAppointments(data.appointments || []);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    if (filter === "all") return true;
    if (filter === "upcoming") {
      return new Date(apt.appointmentDate) >= new Date() && apt.status !== "CANCELLED" && apt.status !== "COMPLETED";
    }
    return apt.status === filter;
  });

  const stats = {
    total: appointments.length,
    pending: appointments.filter((a) => a.status === "PENDING").length,
    confirmed: appointments.filter((a) => a.status === "CONFIRMED").length,
    completed: appointments.filter((a) => a.status === "COMPLETED").length,
  };

  return (
    <AuthGuard>
      <DashboardLayout>
        <main className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
          <div className="container-wide py-4 sm:py-6 lg:py-8">
            {/* Header */}
            <DashboardHeader
              title="Appointments"
              subtitle="Manage your counseling appointments"
              onLogout={() => {
                localStorage.removeItem("token");
                router.push("/login");
              }}
            />

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="stat-card">
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Total
                  </p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {stats.total}
                  </p>
                </div>
              </div>
              <div className="stat-card">
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Pending
                  </p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                    {stats.pending}
                  </p>
                </div>
              </div>
              <div className="stat-card">
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Confirmed
                  </p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {stats.confirmed}
                  </p>
                </div>
              </div>
              <div className="stat-card">
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Completed
                  </p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    {stats.completed}
                  </p>
                </div>
              </div>
            </div>

            {/* Book Appointment Button (Users only) */}
            {userRole === "USER" && (
              <div className="mb-8">
                <button
                  onClick={() => setShowBooking(!showBooking)}
                  className="btn-primary"
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>{showBooking ? "Hide Booking Form" : "Book New Appointment"}</span>
                  </div>
                </button>
              </div>
            )}

            {/* Booking Form */}
            {showBooking && userRole === "USER" && (
              <div className="mb-8">
                <AppointmentBooking
                  onSuccess={() => {
                    setShowBooking(false);
                    fetchAppointments();
                  }}
                />
              </div>
            )}

            {/* Filter */}
            <div className="glass-card p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">My Appointments</h3>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600 dark:text-gray-400 font-medium">Filter:</label>
                  <select
                    className="input-pro py-2"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="all">All Appointments</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Appointments List */}
            <AppointmentsList
              appointments={filteredAppointments}
              isLoading={isLoading}
              onRefresh={fetchAppointments}
              userRole={userRole}
            />
          </div>
        </main>
      </DashboardLayout>
    </AuthGuard>
  );
}

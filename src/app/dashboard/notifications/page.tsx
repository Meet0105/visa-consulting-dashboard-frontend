"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import DashboardHeader from "@/components/DashboardHeader";
import { Notification, NotificationType } from "@/types/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | NotificationType>("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      let url = `${API_URL}/notifications?page=${page}&limit=20`;

      if (filter === "unread") {
        url += "&isRead=false";
      } else if (filter !== "all") {
        url += `&type=${filter}`;
      }

      const res = await fetch(url, {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [filter, page]);

  const handleNotificationClick = async (notification: Notification) => {
    try {
      if (!notification.isRead) {
        await fetch(`${API_URL}/notifications/${notification.id}/read`, {
          method: "PATCH",
          credentials: "include",
        });

        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id ? { ...n, isRead: true } : n
          )
        );
      }

      if (notification.link) {
        router.push(notification.link);
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await fetch(`${API_URL}/notifications/mark-all-read`, {
        method: "PATCH",
        credentials: "include",
      });

      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`${API_URL}/notifications/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "APPLICATION":
        return "📄";
      case "DOCUMENT":
        return "📎";
      case "APPOINTMENT":
        return "📅";
      case "CLASS":
        return "📚";
      case "SYSTEM":
        return "⚙️";
      default:
        return "🔔";
    }
  };

  const timeAgo = (date: string) => {
    const seconds = Math.floor(
      (new Date().getTime() - new Date(date).getTime()) / 1000
    );

    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <DashboardHeader
          title="Notifications"
          subtitle="Stay updated with all your important alerts"
          onLogout={handleLogout}
        />

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-3">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "unread"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Unread
          </button>
          <button
            onClick={() => setFilter("APPLICATION")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "APPLICATION"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            📄 Applications
          </button>
          <button
            onClick={() => setFilter("DOCUMENT")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "DOCUMENT"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            📎 Documents
          </button>
          <button
            onClick={() => setFilter("APPOINTMENT")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "APPOINTMENT"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            📅 Appointments
          </button>
          <button
            onClick={() => setFilter("CLASS")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "CLASS"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            📚 Classes
          </button>
          <button
            onClick={() => setFilter("SYSTEM")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "SYSTEM"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            ⚙️ System
          </button>
          <button
            onClick={handleMarkAllRead}
            className="ml-auto px-4 py-2 rounded-lg font-medium bg-green-600 text-white hover:bg-green-700 transition-colors"
          >
            Mark All Read
          </button>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-lg shadow">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No notifications found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors ${
                    !notification.isRead ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <button
                        onClick={() => handleNotificationClick(notification)}
                        className="text-left w-full"
                      >
                        <p
                          className={`text-sm ${
                            !notification.isRead
                              ? "font-semibold text-gray-900"
                              : "text-gray-700"
                          }`}
                        >
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {timeAgo(notification.createdAt)}
                        </p>
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      {!notification.isRead && (
                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      )}
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete notification"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-700">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-lg bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

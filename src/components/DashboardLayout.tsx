"use client";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [userRole, setUserRole] = useState<"ADMIN" | "MANAGER" | "USER">("USER");

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setUserRole(user.role);
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar userRole={userRole} />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {children}
      </div>
    </div>
  );
}

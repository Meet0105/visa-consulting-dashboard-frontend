"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: "ADMIN" | "MANAGER" | "USER";
}

export default function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Check if user has token in localStorage
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (!token || !userStr) {
      console.log("No auth token found, redirecting to login");
      router.push("/login");
      return;
    }

    try {
      const user = JSON.parse(userStr);
      console.log("Auth token found, user role:", user.role);

      // Check role-based access
      if (requiredRole) {
        if (requiredRole === "ADMIN" && user.role !== "ADMIN") {
          console.log("Access denied: User is not ADMIN");
          const correctDashboard = user.role === "MANAGER" ? "/dashboard/manager" : "/dashboard/user";
          router.push(correctDashboard);
          return;
        }

        if (requiredRole === "MANAGER" && !["MANAGER", "ADMIN"].includes(user.role)) {
          console.log("Access denied: User is not MANAGER or ADMIN");
          const correctDashboard = user.role === "ADMIN" ? "/dashboard/admin" : "/dashboard/user";
          router.push(correctDashboard);
          return;
        }

        if (requiredRole === "USER" && user.role !== "USER") {
          console.log("Access denied: User is not USER");
          const correctDashboard = user.role === "ADMIN" ? "/dashboard/admin" : "/dashboard/manager";
          router.push(correctDashboard);
          return;
        }
      }

      setIsAuthorized(true);
      setIsChecking(false);
    } catch (error) {
      console.error("Error parsing user data:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/login");
    }
  }, [router, requiredRole, pathname]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}

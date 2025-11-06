import { NextResponse, NextRequest } from "next/server"; 
import { jwtVerify } from "jose"; 

const encoder = new TextEncoder(); 
async function verifyToken(token: string) { 
  const secret = process.env.JWT_SECRET; 
  if (!secret) throw new Error("JWT_SECRET not set in web/.env.local"); 
  const { payload } = await jwtVerify(token, encoder.encode(secret)); 
  return payload as { 
    id: string; 
    role: "ADMIN" | "MANAGER" | "USER"; 
    exp?: number; 
  }; 
} 

export async function middleware(req: NextRequest) { 
  const { pathname } = req.nextUrl; 
  const protectedPaths = ["/dashboard"]; 
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p)); 

  if (!isProtected) return NextResponse.next(); 

  // Check for token in cookie
  const token = req.cookies.get("token")?.value;
  
  console.log("Middleware checking path:", pathname);
  console.log("Token in cookie:", !!token);
  
  // If no token, redirect to login
  if (!token) {
    console.log("No token found - redirecting to login");
    return NextResponse.redirect(new URL("/login", req.url));
  } 
  
  try { 
    const payload = await verifyToken(token);
    console.log("Token verified successfully for user:", payload.id, "role:", payload.role); 

    // Check token expiration
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      console.log("Token expired - redirecting to login");
      const res = NextResponse.redirect(new URL("/login", req.url));
      res.cookies.set("token", "", { expires: new Date(0) });
      return res;
    }

    // Role-based access control
    if (pathname.startsWith("/dashboard/admin") && payload.role !== "ADMIN") {
      console.log("Access denied: User is not ADMIN");
      // Redirect to their correct dashboard
      const correctDashboard = payload.role === "MANAGER" ? "/dashboard/manager" : "/dashboard/user";
      return NextResponse.redirect(new URL(correctDashboard, req.url));
    }
    
    if (pathname.startsWith("/dashboard/manager") && !["MANAGER", "ADMIN"].includes(payload.role)) {
      console.log("Access denied: User is not MANAGER or ADMIN");
      // Redirect to their correct dashboard
      const correctDashboard = payload.role === "ADMIN" ? "/dashboard/admin" : "/dashboard/user";
      return NextResponse.redirect(new URL(correctDashboard, req.url));
    }
    
    if (pathname.startsWith("/dashboard/user") && payload.role !== "USER") {
      console.log("Access denied: User is not USER");
      // Redirect to their correct dashboard
      const correctDashboard = payload.role === "ADMIN" ? "/dashboard/admin" : "/dashboard/manager";
      return NextResponse.redirect(new URL(correctDashboard, req.url));
    }

    return NextResponse.next(); 
  } catch (err) {
    console.error("Web middleware JWT error:", err);
    console.error("Token value (first 20 chars):", token?.substring(0, 20));
    console.error("JWT_SECRET exists:", !!process.env.JWT_SECRET);
    const res = NextResponse.redirect(new URL("/login", req.url));
    res.cookies.set("token", "", { expires: new Date(0) });
    return res;
  }
} 

export const config = {
  matcher: ["/dashboard/:path*"],
};
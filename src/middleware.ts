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

  // Check for token in cookie (works for localhost)
  const token = req.cookies.get("token")?.value;
  
  console.log("Middleware checking path:", pathname);
  console.log("Token in cookie:", !!token);
  
  // For production with localStorage tokens, we can't check here
  // The check will happen client-side in the dashboard pages
  // So we allow the request through and let client-side handle it
  if (!token) {
    console.log("No cookie token - allowing through for client-side check");
    // Don't redirect here - let the page load and check localStorage
    return NextResponse.next();
  } 
  try { 
    const payload = await verifyToken(token);
    console.log("Token verified successfully for user:", payload.id, "role:", payload.role); 

    if (payload.exp && Date.now() >= payload.exp * 1000) {
      const res = NextResponse.redirect(new URL("/login", req.url));
      res.cookies.set("token", "", { expires: new Date(0) });
      return res;
    }

    if (pathname.startsWith("/dashboard/admin") && payload.role !== "ADMIN") {
      const res = NextResponse.redirect(new URL("/login", req.url));
      res.cookies.set("token", "", { expires: new Date(0) });
      return res;
    }
    if (
      pathname.startsWith("/dashboard/manager") &&
      !["MANAGER", "ADMIN"].includes(payload.role)
    ) {
      const res = NextResponse.redirect(new URL("/login", req.url));
      res.cookies.set("token", "", { expires: new Date(0) });
      return res;
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
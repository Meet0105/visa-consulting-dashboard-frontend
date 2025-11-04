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
  const protectedPaths = ["/dashboard", "/admin", "/manager"]; 
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p)); 

  if (!isProtected) return NextResponse.next(); 

  const token = req.cookies.get("token")?.value; 
  if (!token) { 
    return NextResponse.redirect(new URL("/login", req.url)); 
  } 
  try { 
    const payload = await verifyToken(token); 

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
    const res = NextResponse.redirect(new URL("/login", req.url));
    res.cookies.set("token", "", { expires: new Date(0) });
    return res;
  }
} 

export const config = {
  matcher: ["/dashboard/:path*"],
};
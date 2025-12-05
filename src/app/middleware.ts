import { NextResponse } from "next/server";

export function middleware(req: any) {
  const role = req.cookies.get("role"); 
  if (!role || role !== "admin") {
    return NextResponse.redirect("/login");
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

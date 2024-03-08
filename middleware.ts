import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default auth((req) => {
  const pathName = req.nextUrl.pathname;
  const currentUser = !!req.auth;
  if (!currentUser && pathName.startsWith("/dashboard")) return NextResponse.redirect(new URL("/login", req.url));
  if (currentUser && (pathName.startsWith("/login") || pathName.startsWith("/signup")))
    return NextResponse.redirect(new URL("/dashboard", req.url));
  if (pathName === "/") return NextResponse.redirect(new URL("/dashboard", req.url));

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup", "/"],
};

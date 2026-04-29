import { NextRequest, NextResponse } from "next/server";
export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

   //  user ke login token ke hisaab se redirect karta hai.
   
  if (
    token &&
    (url.pathname.startsWith("/sign-in") ||
    url.pathname.startsWith("/sign-up") ||
    url.pathname.startsWith("/verfiy") ||
    url.pathname.startsWith("/"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.redirect(new URL("/home", request.url));
}

export const config = {
  matcher: ["sign-in", "sign--up", "/", "/dashboard/:path*", "/verfiy/:path*"],
};

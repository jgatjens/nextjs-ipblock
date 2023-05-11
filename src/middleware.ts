import { redirect } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";

// 45.42.61.18
// const blockedIps = ["32.220.59.105", "201.192.155.24"];

// eslint-disable-next-line
export default async function (req: NextRequest) {
  const res = NextResponse.next();
  let ip = req.ip ?? req.headers.get("x-real-ip");
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (!ip && forwardedFor) {
    ip = forwardedFor.split(",").at(0) ?? "Unknown";
  }

  if (ip !== "45.42.61.18") {
    const url = req.nextUrl.clone();
    url.pathname = `/404`;
    return NextResponse.rewrite(url);
  }

  if (ip) {
    res.cookies.set("user-ip", ip, {
      httpOnly: false,
    });
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

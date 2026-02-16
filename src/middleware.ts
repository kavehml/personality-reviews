import { auth } from "@/lib/auth";

const publicPaths = ["/", "/login", "/signup"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isPublic = publicPaths.includes(pathname) || pathname.startsWith("/api/auth");

  if (isPublic) return;

  if (!req.auth) {
    const url = new URL("/login", req.nextUrl.origin);
    url.searchParams.set("callbackUrl", pathname);
    return Response.redirect(url);
  }

  return;
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};

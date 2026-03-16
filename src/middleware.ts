import { withAuth } from "next-auth/middleware";

const publicPaths = ["/", "/login", "/signup"];

export default withAuth(
  function middleware() {
    // User is authenticated; let them through
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const pathname = req.nextUrl.pathname;
        if (pathname.startsWith("/api")) return true; // Don't block API
        if (publicPaths.includes(pathname)) return true;
        return !!token;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};

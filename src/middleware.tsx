import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Check if the user is authenticated and trying to access sign-in or sign-up
    if (token && (pathname === "/signin" || pathname === "/signup")) {
      return NextResponse.redirect(new URL("/", req.url)); // Redirect to the home page
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Allow access to signin and signup pages without authentication
        if (pathname === "/signin" || pathname === "/signup") {
          return true;
        }
        
        // Require authentication for all other pages
        return !!token;
      },
    },
  },
);

// Specify which routes should be protected by the middleware
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};


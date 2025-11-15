import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Example: roles allowed per route
const routeRoles: Record<string, string[]> = {
    "/admin": ["admin"],
    "/products": ["admin", "user"],
    "/shopping-lists": ["user", "admin"],
};

export function getUserRoleFromJWT(token: string | undefined): string | null {
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.role || null;
    } catch {
        return null;
    }
}

export function roleMiddleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const allowedRoles = routeRoles[pathname];
    if (!allowedRoles) return NextResponse.next();

    const token = request.cookies.get("token")?.value;
    const userRole = getUserRoleFromJWT(token);

    if (!userRole || !allowedRoles.includes(userRole)) {
        return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
}

export const roleMiddlewareConfig = {
    matcher: ["/admin", "/products", "/shopping-lists"],
};

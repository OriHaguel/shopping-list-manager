// NavbarWrapper.tsx
"use client";
import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";

export function SidebarWrapper() {
    const pathname = usePathname();
    const hideNavbar = pathname === "/en" || pathname.startsWith("/en/auth") || pathname.startsWith("/en/list/join");

    if (hideNavbar) return null;
    return <Sidebar />;
}

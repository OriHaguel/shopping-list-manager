// NavbarWrapper.tsx
"use client";
import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";

export function SidebarWrapper() {
    const pathname = usePathname();
    const hideNavbar = pathname === "/" || pathname.startsWith("/auth");

    if (hideNavbar) return null;
    return <Sidebar />;
}

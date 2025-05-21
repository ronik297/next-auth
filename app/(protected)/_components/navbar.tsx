"use client";

import { usePathname } from "next/navigation";
import Link  from "next/link";
import { Button } from "@/components/ui/button";
import { UserButton } from "@/components/auth/user-button";

export const Navbar = () => {
    const pathname = usePathname();

    return (
        <nav className="bg-secondary flex justify-between items-center p-4
        rounded-xl w-[600px] shadow-sm">
            <div className="flex gap-x-2">
                <Button asChild variant={pathname === "/server" ? "default" : "outline"}>
                    <Link href="/server" className="text-black">
                        Settings
                    </Link>
                </Button>
                <Button asChild variant={pathname === "/client" ? "default" : "outline"}>
                    <Link href="/client" className="text-black">
                        Client
                    </Link>
                </Button>
                <Button asChild variant={pathname === "/admin" ? "default" : "outline"}>
                    <Link href="/admin" className="text-black">
                        Admin
                    </Link>
                </Button>
                <Button asChild variant={pathname === "/settings" ? "default" : "outline"}>
                    <Link href="/settings" className="text-white">
                        Settings
                    </Link>
                </Button>
            </div>
            <UserButton />
        </nav>
    )
}
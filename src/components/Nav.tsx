"use client";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import clsx from "clsx";

export default function Nav() {
  const router = useRouter();
  const pathname = usePathname();
  const { status } = useSession();

  const navLink = (label: string, path: string) => (
    <div
      key={path}
      className={clsx(
        "col-span-2 cursor-pointer hover:underline",
        pathname === path && "font-bold"
      )}
      onClick={() => router.push(path)}
    >
      {label}
    </div>
  );

  return (
    <div className="bg-blue-800 min-h-[64px] grid grid-cols-12 items-center text-center">
      <div className="col-span-4 text-left pl-4 font-semibold text-lg">
        Camaleonic Analytics
      </div>
      {navLink("Home", "/")}
      {navLink("Dashboard", "/dashboard")}
      {navLink("Topics", "/topics")}
      {status === "authenticated"
        ? navLink("Signout", "/api/auth/signout")
        : navLink("Signin", "/login")}
    </div>
  );
}

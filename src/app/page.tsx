"use client";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return <div>Hello {session?.user?.name}</div>;
}

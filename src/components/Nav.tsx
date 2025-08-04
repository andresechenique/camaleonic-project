"use client"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react";

export default function Nav() {
  const router = useRouter();
  const {status} = useSession();
  
  return <div className="bg-blue-800 min-h-[64px] grid grid-cols-12 items-center text-center">
            <div className="col-span-4 text-left pl-4">Camaleonic Analytics</div>
            <div className="col-span-2" onClick={() => router.push('/')}>Home</div>
            <div className="col-span-2" onClick={() => router.push('/dashboard')}>Dashboard</div>
            <div className="col-span-2" onClick={() => router.push('/tables')}>Tables</div>
            {status === 'authenticated' ? 
              <div className="col-span-2" onClick={() => router.push('/api/auth/signout')}>Signout</div> 
              : 
              <div className="col-span-2" onClick={() => router.push('/login')}>Signin</div> 
            }
          </div>

}
'use client';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import clsx from 'clsx';

export default function Nav() {
	const router = useRouter();
	const pathname = usePathname();
	const { status } = useSession();

	const navLink = (label: string, path: string) => (
		<div
			key={path}
			className={clsx(
				'col-span-2 text-xs sm:text-lg cursor-pointer hover:underline',
				pathname === path && 'font-bold',
			)}
			onClick={() => router.push(path)}
		>
			{label}
		</div>
	);

	return (
		<div className="bg-black min-h-[64px] flex justify-between items-center text-center px-4">
			<div className="text-left font-semibold text-lg flex items-center gap-2">
				<img alt="logo" src={'/logo.png'} className="max-h-[40px]" />
				<p className="hidden md:block">FutCalendar</p>
			</div>
			{status === 'authenticated' ? (
				<div className="flex justify-between items-center gap-4 md:gap-8">
					{navLink('Home', '/')}
					{navLink('Dashboard', '/dashboard')}
					{navLink('Matches', '/matches')}
					{navLink('Topics', '/topics')}
					{navLink('Signout', '/api/auth/signout')}
				</div>
			) : (
				<div className="flex justify-between items-center gap-8">
					{navLink('Home', '/')}
					{navLink('Signin', '/login')}
				</div>
			)}
		</div>
	);
}

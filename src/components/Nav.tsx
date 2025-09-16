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
		<div className="bg-black min-h-[64px] grid grid-cols-12 items-center text-center">
			<img
				alt="logo"
				src={'https://camaleonicanalytics.com/assets/frontend/images/logo.png'}
				className="col-span-2 text-left pl-4 font-semibold text-lg max-h-[40px]"
			/>
			{status === 'authenticated' && navLink('Home', '/')}
			{status === 'authenticated' && navLink('Dashboard', '/dashboard')}
			{status === 'authenticated' && navLink('Matches', '/matches')}
			{status === 'authenticated' && navLink('Topics', '/topics')}
			{status === 'authenticated'
				? navLink('Signout', '/api/auth/signout')
				: navLink('Signin', '/login')}
		</div>
	);
}

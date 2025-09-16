'use client';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Home() {
	const { data: session, status } = useSession();

	return (
		<div className="relative col-span-12 flex flex-col justify-center px-4 bg-cover bg-center">
			{/* Background layer */}
			<div
				className="absolute inset-0 bg-cover bg-center opacity-30 z-0"
				style={{
					backgroundImage: 'url("/background.gif")',
				}}
			/>

			{/* Content layer */}
			<div className="relative z-10 flex flex-col items-center justify-center text-center">
				<h1 className="text-4xl font-bold mb-4">
					Welcome to FutCalendar
					{session?.user?.name ? `, ${session.user.name}` : ''}!
				</h1>
				{status === 'authenticated' ? (
					<div className="flex flex-col gap-8 justify-center text-center">
						<p className="text-lg max-w-xl">
							This is your central hub. From here, you can access your
							personalized dashboard and explore a variety of data about the
							matches you have registered to enhance your experience.
						</p>

						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Link href="/dashboard">
								<button className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition">
									Go to Dashboard
								</button>
							</Link>
							<Link href="/matches">
								<button className="inline-block bg-gray-200 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-300 transition">
									Explore Matches
								</button>
							</Link>
						</div>
					</div>
				) : (
					<div className="flex flex-col gap-8 justify-center text-center">
						<p className="text-lg max-w-xl">
							Sign in to get started! Our app helps you keep track of the
							football matches you watch and record your experiences.
						</p>

						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Link href="/login">
								<button className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition">
									Sign In
								</button>
							</Link>
							<Link href="/register">
								<button className="inline-block bg-gray-200 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-300 transition">
									Create Account
								</button>
							</Link>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

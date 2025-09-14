import type { Metadata } from 'next';
import { Source_Code_Pro } from 'next/font/google';
import './globals.css';
import Nav from '@/components/Nav';
import Providers from './Providers';

const font = Source_Code_Pro({
	variable: '--font-source-code-pro',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'FutCalendar',
	description: 'A calendar to register for your football matches',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${font.variable} antialiased text-white`}>
				<Providers>
					<Nav />
					<div className="bg-gray-800 min-h-[calc(100svh_-_64px)] grid grid-cols-12">
						{children}
					</div>
				</Providers>
			</body>
		</html>
	);
}

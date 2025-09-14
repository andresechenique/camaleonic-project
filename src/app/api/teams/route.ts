import { connectDB } from '@/libs/mongodb';
import Team from '@/models/teams';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
	try {
		await connectDB();

		const { searchParams } = new URL(request.url);
		const competition = searchParams.get('competition');

		let query = {};
		if (competition) {
			query = { competition };
		}

		const teams = await Team.find(query).select('_id team competition');
		return NextResponse.json(teams);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ message: 'Failed to fetch teams' },
			{ status: 500 },
		);
	}
}

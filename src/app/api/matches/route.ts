import { connectDB } from '@/libs/mongodb';
import Matches from '@/models/matches';
import { NextResponse } from 'next/server';

interface MatchFilter {
	author: string;
	date?: {
		$lte: Date;
	};
}

export async function GET(request: Request) {
	try {
		await connectDB();

		const { searchParams } = new URL(request.url);

		const userId = searchParams.get('userId'); // usuario que solicita los matches
		const dateParam = searchParams.get('date'); // fecha en formato 'YYYY-MM-DD'

		if (!userId) {
			return NextResponse.json(
				{ message: 'User ID is required' },
				{ status: 400 },
			);
		}

		const filter: MatchFilter = { author: userId };

		if (dateParam) {
			// Convertimos la fecha seleccionada al final del día
			const end = new Date(dateParam);
			end.setHours(23, 59, 59, 999);

			filter.date = { $lte: end };
		}

		const matches = await Matches.find(filter).select(
			'_id date team1 team2 scoreTeam1 scoreTeam2 competition favPlayer where rating',
		);
		return NextResponse.json(matches);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ message: 'Failed to fetch matches' },
			{ status: 500 },
		);
	}
}

export async function POST(request: Request) {
	try {
		await connectDB();
		const {
			date,
			team1,
			team2,
			scoreTeam1,
			scoreTeam2,
			competition,
			favPlayer,
			where,
			rating,
			createdBy,
		} = await request.json();

		const match = new Matches({
			date,
			team1,
			team2,
			scoreTeam1,
			scoreTeam2,
			competition,
			favPlayer,
			where,
			rating,
			author: createdBy, // asegúrate de que es un string válido
		});

		console.log(match); // ahora sí debería aparecer

		const savedMatch = await match.save();

		return NextResponse.json(savedMatch, { status: 201 });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ message: error instanceof Error ? error.message : 'Unknown error' },
			{ status: 400 },
		);
	}
}

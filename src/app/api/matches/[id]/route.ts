import { connectDB } from '@/libs/mongodb';
import Match from '@/models/matches';
import { NextResponse } from 'next/server';

export async function PUT(request: Request) {
	const {
		_id,
		date,
		team1,
		team2,
		scoreTeam1,
		scoreTeam2,
		competition,
		favPlayer,
		where,
		rating,
	} = await request.json();

	if (!_id) {
		return NextResponse.json(
			{ message: 'Match ID is required' },
			{ status: 400 },
		);
	}

	try {
		await connectDB();
		const updatedMatch = await Match.findByIdAndUpdate(
			_id,
			{
				date,
				team1,
				team2,
				scoreTeam1,
				scoreTeam2,
				competition,
				favPlayer,
				where,
				rating,
			},
			{ new: true, runValidators: true },
		);
		if (!updatedMatch) {
			return NextResponse.json({ message: 'Match not found' }, { status: 404 });
		}
		return NextResponse.json(updatedMatch);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ message: 'Failed to update match' },
			{ status: 500 },
		);
	}
}

export async function DELETE(request: Request) {
	const url = new URL(request.url);
	const id = url.pathname.split('/').pop();

	if (!id) {
		return NextResponse.json(
			{ message: 'Match ID is required' },
			{ status: 400 },
		);
	}

	try {
		await connectDB();
		const deletedMatch = await Match.findByIdAndDelete(id);
		if (!deletedMatch) {
			return NextResponse.json({ message: 'Match not found' }, { status: 404 });
		}
		return NextResponse.json({ message: 'Match deleted successfully' });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ message: 'Failed to delete match' },
			{ status: 500 },
		);
	}
}

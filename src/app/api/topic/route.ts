import { connectDB } from '@/libs/mongodb';
import Topic from '@/models/topics';
import { NextResponse } from 'next/server';

export async function GET() {
	try {
		await connectDB();
		const topics = await Topic.find().select('title description points');
		return NextResponse.json(topics);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ message: 'Failed to fetch topics' },
			{ status: 500 },
		);
	}
}

export async function POST(request: Request) {
	const { title, description, points } = await request.json();
	try {
		await connectDB();
		const topic = new Topic({ title, description, points });
		const res = await topic.save();
		const _id = res._id;
		return NextResponse.json({ _id, title, description, points });
	} catch (error) {
		console.error(error);
		if (error instanceof Error) {
			return NextResponse.json({ message: error.message }, { status: 400 });
		}
	}
}

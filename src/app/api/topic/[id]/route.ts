import { connectDB } from "@/libs/mongodb";
import Topic from "@/models/topics";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
    const { id, title, description, points } = await request.json();

    if (!id) {
        return NextResponse.json({ message: "Topic ID is required" }, { status: 400 });
    }


    try {
        await connectDB();
        const updatedTopic = await Topic.findByIdAndUpdate(
            id,
            { title, description, points },
            { new: true, runValidators: true }
        );
        if (!updatedTopic) {
            return NextResponse.json({ message: "Topic not found" }, { status: 404 });
        }
        return NextResponse.json(updatedTopic);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to update topic" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
   const url = new URL(request.url);
  const id = url.pathname.split("/").pop();

    if (!id) {
        return NextResponse.json({ message: "Topic ID is required" }, { status: 400 });
    }

    try {
        await connectDB();
        const deletedTopic = await Topic.findByIdAndDelete(id);
        if (!deletedTopic) {
            return NextResponse.json({ message: "Topic not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Topic deleted successfully" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to delete topic" }, { status: 500 });
    }
}
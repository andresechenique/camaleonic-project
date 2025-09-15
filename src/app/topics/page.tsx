'use client';

import { FormEvent, useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import { Topic } from '@/interfaces';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { TopicService } from '@/app/services';
import { Pencil, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Topics() {
	const [topics, setTopics] = useState<Topic[]>([]);
	const [openCreate, setOpenCreate] = useState(false);
	const [openEditId, setOpenEditId] = useState<string | null>(null);
	const [openDeleteId, setOpenDeleteId] = useState<string | null>(null);
	const [error, setError] = useState<string>();

	useEffect(() => {
		getTopics();
	}, []);

	const getTopics = async () => {
		try {
			const items = await TopicService.getTopics();
			setTopics(items);
		} catch (error) {
			console.error('Failed to fetch topics:', error);
		}
	};

	const createTopic = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		try {
			const res = await TopicService.createTopic(
				formData.get('title'),
				formData.get('description'),
				Number(formData.get('points')),
			);
			console.log(res);
			setTopics((prev) => [...prev, res]);
			setOpenCreate(false);
		} catch (error) {
			if (error instanceof AxiosError) {
				setError(error.response?.data.message);
			}
		}
	};

	const deleteTopic = async (id: string) => {
		try {
			await TopicService.deleteTopic(id);
			setTopics((prev) => prev.filter((topic) => topic._id !== id));
			setOpenDeleteId(null);
		} catch (error) {
			console.error('Failed to delete topic:', error);
		}
	};

	const updateTopic = async (e: FormEvent<HTMLFormElement>, id: string) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		try {
			const response = await TopicService.updateTopic(
				id,
				formData.get('title'),
				formData.get('description'),
				Number(formData.get('points')),
			);
			setTopics((prev) =>
				prev.map((topic) => (topic._id === id ? response : topic)),
			);
			setOpenEditId(null);
		} catch (error) {
			if (error instanceof AxiosError) {
				setError(error.response?.data.message);
			}
		}
	};

	return (
		<div className="col-span-12 flex flex-col gap-4 p-4 text-white">
			<div className="flex items-center justify-between">
				<h2 className="text-4xl font-bold ">Topics</h2>
				{/* Add Topic Dialog */}
				<Dialog open={openCreate} onOpenChange={setOpenCreate}>
					<DialogTrigger className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition">
						Add Topic
					</DialogTrigger>
					<DialogContent className="bg-gray-800 text-white max-w-xs  md:max-w-2xl">
						<DialogHeader>
							<DialogTitle>Add new topic</DialogTitle>
							<form className="flex flex-col gap-2" onSubmit={createTopic}>
								<input
									type="text"
									placeholder="Title"
									name="title"
									className="bg-gray-700 rounded-lg p-3 .placeholder-white min-w-64"
								/>
								<input
									type="text"
									placeholder="Description"
									name="description"
									className="bg-gray-700 rounded-lg p-3 .placeholder-white min-w-64"
								/>
								<input
									type="number"
									placeholder="Interest Points"
									name="points"
									className="bg-gray-700 rounded-lg p-3 .placeholder-white min-w-64"
								/>
								{error && <div className=" text-red-400 text-xs">{error}</div>}
								<button
									type="submit"
									className="px-6 py-2 bg-blue-800 rounded-lg"
								>
									Add
								</button>
							</form>
						</DialogHeader>
					</DialogContent>
				</Dialog>
			</div>
			<div className="flex flex-col gap-2 overflow-y-auto max-h-[calc(100svh_-_160px)] custom-scrollbar">
				<div className="p-4 rounded-lg text-gray-400 items-center justify-left hidden lg:flex">
					<div className="flex flex-col w-full lg:flex-row gap-2 lg:gap-12">
						<div className="w-36 lg:w-full">Title</div>
						<div className="w-54 lg:w-full">Description</div>
						<div className="w-8 lg:w-full text-center">Interest Points</div>
					</div>
					<div className="flex flex-col lg:flex-row gap-2 lg:gap-12 text-right">
						<div className="w-8 lg:w-[68px] text-center">Edit</div>
						<div className="w-8 lg:w-[68px] text-center">Delete</div>
					</div>
				</div>
				{topics.length > 0
					? topics.map((topic) => (
							<div
								key={topic._id}
								className="flex p-4 rounded-lg border border-gray-700 items-center justify-between min-h-[84px]"
							>
								<div className="flex flex-col w-full lg:flex-row gap-2 lg:gap-12">
									<div className="w-36 lg:w-full">{topic.title}</div>
									<div className="w-54 truncate lg:w-full">
										{topic.description}
									</div>
									<div className="w-8 lg:w-full text-center">
										{topic.points}
									</div>
								</div>
								{/* Update Topic Dialog */}
								<div className="flex flex-col lg:flex-row gap-2 lg:gap-12 text-right">
									<Dialog
										open={openEditId === topic._id}
										onOpenChange={(isOpen) =>
											setOpenEditId(isOpen ? topic._id : null)
										}
									>
										<DialogTrigger className="inline-block border-2 border-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition ">
											<Pencil className="w-4 h-4" />
										</DialogTrigger>
										<DialogContent className="bg-gray-800 text-white max-w-xs  md:max-w-2xl">
											<DialogHeader>
												<DialogTitle>Edit topic</DialogTitle>
												<form
													className="flex flex-col gap-2"
													onSubmit={(e) => updateTopic(e, topic._id)}
												>
													<input
														defaultValue={topic.title}
														type="text"
														placeholder="Title"
														name="title"
														className="bg-gray-700 rounded-lg p-3 .placeholder-white min-w-64"
													/>
													<input
														defaultValue={topic.description}
														type="text"
														placeholder="Description"
														name="description"
														className="bg-gray-700 rounded-lg p-3 .placeholder-white min-w-64"
													/>
													<input
														defaultValue={topic.points}
														type="number"
														placeholder="Interest Points"
														name="points"
														className="bg-gray-700 rounded-lg p-3 .placeholder-white min-w-64"
													/>
													{error && (
														<div className=" text-red-400 text-xs">{error}</div>
													)}
													<button
														type="submit"
														className="px-6 py-2 bg-blue-800 rounded-lg"
													>
														Update
													</button>
												</form>
											</DialogHeader>
										</DialogContent>
									</Dialog>
									{/* Delete Topic Dialog */}
									<Dialog
										open={openDeleteId === topic._id}
										onOpenChange={(isOpen) =>
											setOpenDeleteId(isOpen ? topic._id : null)
										}
									>
										<DialogTrigger className="inline-block border-2 border-red-700 text-white px-6 py-3 rounded-md hover:bg-red-800 transition">
											<Trash2 className="w-4 h-4" />
										</DialogTrigger>
										<DialogContent className="bg-gray-800 text-white max-w-xs  md:max-w-2xl">
											<DialogHeader>
												<DialogTitle>Delete topic</DialogTitle>
												<DialogDescription className="text-white">
													Are you sure you want to delete this topic?
												</DialogDescription>
												<button
													className="px-6 py-2 mt-4 bg-red-800 rounded-lg"
													onClick={() => deleteTopic(topic._id)}
												>
													Delete
												</button>
											</DialogHeader>
										</DialogContent>
									</Dialog>
								</div>
							</div>
						))
					: Array.from({ length: 4 }).map((_, i) => (
							<Skeleton key={i} className="h-[84px] w-full rounded-lg" />
						))}
			</div>
		</div>
	);
}

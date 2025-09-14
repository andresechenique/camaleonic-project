'use client';
// import { Toggle } from '@/components/ui/toggle';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { useSession } from 'next-auth/react';
import { FormEvent, useEffect, useState } from 'react';
import { Match } from '@/interfaces';
import { MatchesService } from '../services/match';
import { AxiosError } from 'axios';

export default function Matches() {
	const [date, setDate] = useState<Date | undefined>(new Date());
	const [matches, setMatches] = useState<Match[]>([]);
	const [error, setError] = useState<string>();

	const { data: session } = useSession();

	useEffect(() => {
		const getMatches = async (date: Date, id: string) => {
			console.log(date, id);
			const res = await MatchesService.getMatches(date, session?.user.id);
			setMatches(res);
		};

		if (!date || !session?.user.id) return;
		getMatches(date, session.user.id);
	}, [date, session?.user.id]);

	const addMatch = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		try {
			const params = {
				date: new Date(String(formData.get('date'))),
				team1: String(formData.get('team1')),
				team2: String(formData.get('team2')),
				scoreTeam1: Number(formData.get('scoreTeam1')),
				scoreTeam2: Number(formData.get('scoreTeam2')),
				competition: String(formData.get('competition')),
				where: String(formData.get('where')),
				rating: Number(formData.get('rating')),
				favPlayer: formData.get('favPlayer')
					? String(formData.get('favPlayer'))
					: undefined,
				createdBy: session?.user.id,
			};
			const res = await MatchesService.addMatch(params);
			setMatches((prev) => [...prev, res]);
		} catch (error) {
			if (error instanceof AxiosError) {
				setError(error.response?.data.message);
			}
		}
	};

	return (
		<div className="col-span-12 grid grid-cols-12 grid-rows-9 gap-4 p-4">
			<div className="col-span-12 row-span-1 p-4">
				<h2 className="text-4xl font-bold">Matches</h2>
			</div>
			<div className="col-span-4 md:col-span-3 lg:col-span-2 row-span-9 bg-gray-700 rounded-xl flex flex-col gap-6 p-4">
				<Dialog>
					<DialogTrigger className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition">
						Add match
					</DialogTrigger>
					<DialogContent className="bg-gray-800 text-white max-w-3xl">
						<DialogHeader>
							<DialogTitle>Add new topic</DialogTitle>
							<form className="flex flex-col gap-4" onSubmit={addMatch}>
								<input
									type="date"
									placeholder="Date"
									name="date"
									className="bg-gray-700 rounded-lg p-3 placeholder-white"
								/>

								<div className="flex gap-4 justify-between items-center">
									<input
										type="text"
										placeholder="Home Team"
										name="team1"
										className="bg-gray-700 rounded-lg p-3 placeholder-white"
									/>

									<input
										type="number"
										placeholder="Score"
										name="scoreTeam1"
										className="bg-gray-700 rounded-lg p-3 placeholder-white max-w-20"
									/>

									<p>VS.</p>

									<input
										type="number"
										placeholder="Score"
										name="scoreTeam2"
										className="bg-gray-700 rounded-lg p-3 placeholder-white max-w-20"
									/>
									<input
										type="text"
										placeholder="Away Team"
										name="team2"
										className="bg-gray-700 rounded-lg p-3 placeholder-white"
									/>
								</div>

								<input
									type="text"
									placeholder="Competition"
									name="competition"
									className="bg-gray-700 rounded-lg p-3 placeholder-white"
								/>

								<input
									type="text"
									placeholder="Favorite Player"
									name="favPlayer"
									className="bg-gray-700 rounded-lg p-3 placeholder-white"
								/>

								<input
									type="text"
									placeholder="Where did you watch it?"
									name="where"
									className="bg-gray-700 rounded-lg p-3 placeholder-white"
								/>

								<input
									type="number"
									placeholder="Rating (0-10)"
									name="rating"
									min={0}
									max={10}
									className="bg-gray-700 rounded-lg p-3 placeholder-white"
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
				<h3 className="text-xl font-semibold">Calendar</h3>
				<div className="">
					<Calendar
						mode="single"
						selected={date}
						onSelect={setDate}
						className="rounded-xl border w-full aspect-square"
					/>
				</div>
				{/* <h3 className="text-xl font-semibold mt-2">Popular competitions</h3>
				<Toggle size={'sm'}>UEFA Champions League</Toggle>
				<Toggle size={'sm'}>UEFA Europa League</Toggle>
				<Toggle size={'sm'}>Premier League</Toggle>
				<Toggle size={'sm'}>La Liga</Toggle> */}
			</div>
			<div className=" col-span-8 md:col-span-9 lg:col-span-10 row-span-9 flex flex-col gap-4">
				{matches.map((match) => (
					<div
						key={match.id}
						className="flex justify-between items-center rounded-xl p-4 border-2 border-gray-700 hover:border-blue-700 transition"
					>
						<p>{new Date(match.date).toLocaleDateString()}</p>
						<p>{match.team1}</p>
						<p>{match.scoreTeam1}</p>
						<p>vs</p>
						<p>{match.scoreTeam2}</p>
						<p>{match.team2}</p>
						<p>{match.competition}</p>
					</div>
				))}
			</div>
		</div>
	);
}

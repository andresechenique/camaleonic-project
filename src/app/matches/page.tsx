'use client';
// import { Toggle } from '@/components/ui/toggle';
import { Calendar } from '@/components/ui/calendar';
import { useSession } from 'next-auth/react';
import { FormEvent, useEffect, useState } from 'react';
import { Match, Team } from '@/interfaces';
import { MatchesService } from '../services/match';
import { AxiosError } from 'axios';
import { AddMatchForm } from './components';
import { MatchItem } from './components/MatchItem';

export default function Matches() {
	const [date, setDate] = useState<Date | undefined>(new Date());
	const [matches, setMatches] = useState<Match[]>([]);
	const [teams, setTeams] = useState<Team[]>([]);
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

	useEffect(() => {
		const getTeams = async () => {
			const res = await MatchesService.getTeams();
			setTeams(res);
		};
		getTeams();
	}, []);

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

	const openMatchDetail = (match: Match) => {};

	return (
		<div className="col-span-12 grid grid-cols-12 grid-rows-9 gap-4 p-4">
			<div className="col-span-12 row-span-1 p-4">
				<h2 className="text-4xl font-bold">Matches</h2>
			</div>
			<div className="col-span-4 md:col-span-3 xl:col-span-2 row-span-9 bg-gray-700 rounded-xl flex flex-col gap-4 p-4">
				<AddMatchForm teams={teams} error={error} addMatch={addMatch} />
				<h3 className="text-xl font-semibold">Calendar</h3>
				<Calendar
					mode="single"
					selected={date}
					onSelect={setDate}
					className="rounded-xl border w-full aspect-square"
				/>
				{/* <h3 className="text-xl font-semibold">Popular competitions</h3>
				<div className="flex flex-col gap-3">
					<Toggle key={'champions'} onClick={(e) => console.log(e)} size={'sm'}>
						UEFA Champions League
					</Toggle>
					<Toggle key={'premier'} size={'sm'}>
						Premier League
					</Toggle>
					<Toggle key={'liga'} size={'sm'}>
						La Liga
					</Toggle>
					<Toggle key={'seriea'} size={'sm'}>
						Serie A
					</Toggle>
				</div> */}
			</div>
			<div className=" col-span-8 md:col-span-9 xl:col-span-10 row-span-9 flex flex-col gap-4">
				{matches.map((match) => (
					<MatchItem match={match} openMatchDetail={openMatchDetail} />
				))}
			</div>
		</div>
	);
}

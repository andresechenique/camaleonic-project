'use client';
// import { Toggle } from '@/components/ui/toggle';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import NameMapper from '@/components/NameMapper';
import { Pencil, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { FormEvent, useEffect, useState } from 'react';
import { Match, Team } from '@/interfaces';
import { MatchesService } from '../services/match';
import { AxiosError } from 'axios';
import { MatchItem, AddMatchForm, DatePicker } from './components';
import IconMapper from '@/components/IconMapper';
import Rating from '@/components/Register';
import { Skeleton } from '@/components/ui/skeleton';

export default function Matches() {
	const [date, setDate] = useState<Date | undefined>(new Date());
	const [matches, setMatches] = useState<Match[] | undefined>();
	const [matchToEdit, setMatchToEdit] = useState<Match>();
	const [matchDetail, setMatchDetail] = useState<Match>();
	const [teams, setTeams] = useState<Team[]>([]);
	const [error, setError] = useState<string>();
	const [isOpenForm, setIsOpenForm] = useState<boolean>(false);
	const [isOpenDetail, setIsOpenDetail] = useState<boolean>(false);
	const { data: session } = useSession();

	useEffect(() => {
		const getTeams = async () => {
			const res = await MatchesService.getTeams();
			setTeams(res);
		};
		getTeams();
	}, []);

	useEffect(() => {
		if (!matchDetail) return;
		setIsOpenDetail(true);
	}, [matchDetail]);

	useEffect(() => {
		const getMatches = async (date: Date, id: string) => {
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
			if (!matches) return;
			setMatches((prev) => [res, ...(prev ?? [])]);
			handleCloseForm();
		} catch (error) {
			if (error instanceof AxiosError) {
				setError(error.response?.data.message);
			}
		}
	};

	const editMatch = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		if (!matchToEdit?._id) return;
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
				_id: matchToEdit?._id,
			};
			const res = await MatchesService.updateMatch(params);
			setMatches((prev) => prev?.map((m) => (m._id === res._id ? res : m)));
			setIsOpenDetail(false);
			handleCloseForm();
		} catch (error) {
			if (error instanceof AxiosError) {
				setError(error.response?.data.message);
			}
		}
	};

	const deleteItem = async (id: string) => {
		if (!matchDetail) return;
		await MatchesService.deleteMatch(id);
		setIsOpenDetail(false);
		setMatches((prev) => prev?.filter((m) => m._id !== matchDetail._id));
	};

	const openMatchEdit = (match: Match) => {
		setMatchToEdit(match);
	};

	const handleCloseForm = () => {
		setIsOpenForm(!isOpenForm);
		setMatchToEdit(undefined);
	};

	return (
		<div className="col-span-12 flex flex-col gap-4 p-8">
			<div className="flex flex-col sm:flex-row justify-between items-center gap-8 sm:min-h-[84px] pb-4">
				<h2 className="text-4xl font-bold">Matches</h2>
				<div className="flex gap-8 items-center">
					<DatePicker date={date} setDate={setDate} />
					<AddMatchForm
						teams={teams}
						error={error}
						addMatch={addMatch}
						match={matchToEdit}
						editMatch={editMatch}
						setIsOpen={setIsOpenForm}
						isOpen={isOpenForm}
						handleClose={handleCloseForm}
					/>
				</div>
			</div>
			{/* <h3 className="text-xl font-semibold">Calendar</h3> */}
			{/* <Calendar
					mode="single"
					selected={date}
					onSelect={setDate}
					className="rounded-xl border w-full aspect-square"
				/> */}
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
			{!matches ? (
				Array.from({ length: 4 }).map((_, i) => (
					<Skeleton
						key={i}
						className="h-[84px] w-full rounded-xl col-span-12"
					/>
				))
			) : matches.length > 0 ? (
				matches.map((match) => (
					<div key={match._id}>
						<MatchItem match={match} setMatchDetail={setMatchDetail} />
					</div>
				))
			) : (
				<div className="text-center text-3xl flex flex-col gap-2 justify-center pt-16">
					<p className="font-semibold">No matches registered</p>
					<p className="text-xl">
						register your first match to visualize it here
					</p>
				</div>
			)}
			{matchDetail && (
				<Dialog
					open={isOpenDetail}
					onOpenChange={() => setIsOpenDetail(!isOpenDetail)}
				>
					<DialogContent className="max-w-xs sm:max-w-md lg:max-w-2xl">
						<DialogTitle>
							{new Date(matchDetail.date).toLocaleDateString()}
						</DialogTitle>
						<div className="flex flex-col gap-3 lg:gap-6">
							<div className="flex items-center justify-center gap-4 py-4 text-md lg:text-3xl text-center">
								<p className="w-full">{matchDetail.team1}</p>
								<p className="w-2 lg:w-4">{matchDetail.scoreTeam1}</p>
								<p className="w-4 lg:w-8">vs</p>
								<p className="w-2 lg:w-4">{matchDetail.scoreTeam2}</p>
								<p className="w-full">{matchDetail.team2}</p>
							</div>
							<div className="flex flex-col lg:flex-row gap-2 items-center justify-between text-md lg:text-xl">
								<div className="flex gap-2 items-center">
									<p>Rating:</p>
									<Rating rating={matchDetail.rating} />
								</div>
								<div className="flex items-center gap-2">
									<p className="font-semibold">
										<NameMapper name={matchDetail.competition} />
									</p>
									<IconMapper name={matchDetail.competition} size={8} />
								</div>
							</div>
							<div className="flex items-center justify-between">
								<button
									className="hover:border-blue-400 rounded-lg border-2 border-blue-600 p-2 aspect-square"
									onClick={() => openMatchEdit(matchDetail)}
								>
									<Pencil className="w-5 hover:text-blue-400  text-blue-600" />
								</button>
								<button className="hover:border-red-400 rounded-lg border-2 border-red-600 p-2 aspect-square">
									<Trash2
										className="w-5 hover:text-red-400  text-red-600"
										onClick={() => deleteItem(matchDetail._id)}
									/>
								</button>
							</div>
							{/* <p>{match.where}</p> */}
							{/* {match.favPlayer && <p>{match.favPlayer}</p>} */}
						</div>
					</DialogContent>
				</Dialog>
			)}
		</div>
	);
}

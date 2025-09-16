import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Match, Team } from '@/interfaces';
import {
	Dispatch,
	FormEvent,
	SetStateAction,
	useEffect,
	useState,
} from 'react';
import StarRating from './StarRating';

interface AddMatchForm {
	teams: Team[];
	error?: string;
	addMatch: (e: FormEvent<HTMLFormElement>) => void;
	editMatch: (e: FormEvent<HTMLFormElement>) => void;
	match?: Match;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	isOpen: boolean;
	handleClose: () => void;
}

export const AddMatchForm = ({
	teams,
	error,
	addMatch,
	match,
	editMatch,
	setIsOpen,
	isOpen,
	handleClose,
}: AddMatchForm) => {
	const [competitionSelected, setCompetitionSelected] = useState<string>();

	useEffect(() => {
		if (!match) return;
		setIsOpen(true);
	}, [match]);

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<DialogTrigger>
				<Button className="bg-blue-600 p-3  hover:bg-blue-700 transition">
					Add match
				</Button>
			</DialogTrigger>
			<DialogContent className="bg-gray-800 text-white max-w-xs  md:max-w-2xl">
				<DialogHeader>
					<DialogTitle>{match ? 'Edit match' : 'Add match'}</DialogTitle>
					<form
						className="flex flex-col gap-4 pt-4"
						onSubmit={match ? editMatch : addMatch}
					>
						{' '}
						<input
							type="date"
							placeholder="Date"
							defaultValue={
								match?.date
									? new Date(match.date).toISOString().split('T')[0]
									: new Date().toISOString().split('T')[0]
							}
							name="date"
							className="bg-gray-700 rounded-lg p-3 placeholder-white"
						/>{' '}
						<select
							name="competition"
							className="bg-gray-700 rounded-lg p-3 text-white appearance-none"
							defaultValue={match ? match.competition : ''}
							onChange={(e) => setCompetitionSelected(e.target.value)}
						>
							{' '}
							<option value="" disabled>
								{' '}
								Competition{' '}
							</option>{' '}
							<option value="champions">UEFA Champions League</option>{' '}
							<option value="laliga">La Liga</option>{' '}
							<option value="seriea">Serie A</option>{' '}
							<option value="premier">Premier League</option>{' '}
						</select>{' '}
						<div className="flex gap-4 flex-col md:flex-row justify-between items-center">
							{' '}
							<select
								defaultValue={match ? match?.team1 : ''}
								name="team1"
								className="bg-gray-700 rounded-lg p-3 placeholder-white w-full appearance-none"
							>
								{' '}
								<option value="" disabled>
									{' '}
									Home Team{' '}
								</option>{' '}
								{teams
									.filter((team) =>
										match
											? team.competition === match.competition
											: team.competition === competitionSelected,
									)
									.map((team) => (
										<option key={team.team} value={team.team}>
											{' '}
											{team.team}{' '}
										</option>
									))}{' '}
							</select>{' '}
							<div className="flex items-center justify-around w-full md:w-auto gap-2">
								{' '}
								<input
									defaultValue={match ? match?.scoreTeam1 : 0}
									type="number"
									placeholder="0"
									name="scoreTeam1"
									className="bg-gray-700 rounded-lg p-3 placeholder-white w-14"
								/>{' '}
								<p>VS.</p>{' '}
								<input
									defaultValue={match ? match?.scoreTeam2 : 0}
									type="number"
									placeholder="0"
									name="scoreTeam2"
									className="bg-gray-700 rounded-lg p-3 placeholder-white w-14"
								/>{' '}
							</div>{' '}
							<select
								defaultValue={match ? match?.team2 : ''}
								name="team2"
								className="bg-gray-700 rounded-lg p-3 placeholder-white w-full appearance-none"
							>
								{' '}
								<option value="" disabled>
									{' '}
									Away Team{' '}
								</option>{' '}
								{teams
									.filter((team) =>
										match
											? team.competition === match.competition
											: team.competition === competitionSelected,
									)
									.map((team) => (
										<option key={team.team} value={team.team}>
											{' '}
											{team.team}{' '}
										</option>
									))}{' '}
							</select>{' '}
						</div>{' '}
						{/* <input type="text" placeholder="Favorite Player" name="favPlayer" className="bg-gray-700 rounded-lg p-3 placeholder-white" /> */}{' '}
						<input
							defaultValue={match ? match?.where : ''}
							type="text"
							placeholder="Where did you watch it?"
							name="where"
							className="bg-gray-700 rounded-lg p-3 placeholder-white"
						/>{' '}
						<div className="mx-auto">
							<StarRating />
						</div>
						{error && <div className=" text-red-400 text-xs">{error}</div>}{' '}
						<button type="submit" className="px-6 py-2 bg-blue-800 rounded-lg">
							{' '}
							Add{' '}
						</button>{' '}
					</form>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
};

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
						className="flex flex-col gap-5 pt-6 w-full max-w-2xl mx-auto"
						onSubmit={match ? editMatch : addMatch}
					>
						{/* Fecha */}
						<input
							type="date"
							placeholder="Date"
							defaultValue={
								match?.date
									? new Date(match.date).toISOString().split('T')[0]
									: new Date().toISOString().split('T')[0]
							}
							name="date"
							className="w-full bg-gray-700 text-white rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
						/>

						{/* Competición */}
						<select
							name="competition"
							className="w-full bg-gray-700 text-white rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition appearance-none"
							defaultValue={match ? match.competition : ''}
							onChange={(e) => setCompetitionSelected(e.target.value)}
						>
							<option value="" disabled>
								Competition
							</option>
							<option value="champions">UEFA Champions League</option>
							<option value="laliga">La Liga</option>
							<option value="seriea">Serie A</option>
							<option value="premier">Premier League</option>
						</select>

						{/* Equipos y marcador */}
						<div className="flex flex-col md:flex-row gap-4 items-center w-full">
							{/* Equipo local */}
							<select
								defaultValue={match ? match?.team1 : ''}
								name="team1"
								className="flex-1 bg-gray-700 text-white rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition appearance-none"
							>
								<option value="" disabled>
									Home Team
								</option>
								{teams
									.filter((team) =>
										match
											? team.competition === match.competition
											: team.competition === competitionSelected,
									)
									.map((team) => (
										<option key={team.team} value={team.team}>
											{team.team}
										</option>
									))}
							</select>

							{/* Marcador */}
							<div className="flex items-center justify-center gap-3">
								<input
									defaultValue={match ? match?.scoreTeam1 : 0}
									type="number"
									placeholder="0"
									name="scoreTeam1"
									className="w-16 bg-gray-700 text-white rounded-xl p-3 text-center focus:ring-2 focus:ring-blue-500 outline-none transition"
								/>
								<span className="text-white font-semibold">VS</span>
								<input
									defaultValue={match ? match?.scoreTeam2 : 0}
									type="number"
									placeholder="0"
									name="scoreTeam2"
									className="w-16 bg-gray-700 text-white rounded-xl p-3 text-center focus:ring-2 focus:ring-blue-500 outline-none transition"
								/>
							</div>

							{/* Equipo visitante */}
							<select
								defaultValue={match ? match?.team2 : ''}
								name="team2"
								className="flex-1 bg-gray-700 text-white rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition appearance-none"
							>
								<option value="" disabled>
									Away Team
								</option>
								{teams
									.filter((team) =>
										match
											? team.competition === match.competition
											: team.competition === competitionSelected,
									)
									.map((team) => (
										<option key={team.team} value={team.team}>
											{team.team}
										</option>
									))}
							</select>
						</div>

						{/* Dónde lo viste */}
						<input
							defaultValue={match ? match?.where : ''}
							type="text"
							placeholder="Where did you watch it?"
							name="where"
							className="w-full bg-gray-700 text-white rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
						/>

						{/* Rating */}
						<input
							defaultValue={match ? match?.rating : 5}
							type="number"
							placeholder="Rating (0-10)"
							name="rating"
							min={0}
							max={10}
							className="w-full bg-gray-700 text-white rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
						/>

						{/* Error */}
						{error && <div className="text-red-400 text-sm">{error}</div>}

						{/* Botón */}
						<button
							type="submit"
							className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition"
						>
							{match ? 'Update Match' : 'Add Match'}
						</button>
					</form>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
};

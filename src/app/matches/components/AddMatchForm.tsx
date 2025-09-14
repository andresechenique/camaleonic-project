import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Team } from '@/interfaces';
import { FormEvent, useState } from 'react';

interface AddMatchForm {
	teams: Team[];
	error?: string;
	addMatch: (e: FormEvent<HTMLFormElement>) => void;
}

export const AddMatchForm = ({ teams, error, addMatch }: AddMatchForm) => {
	const [competitionSelected, setCompetitionSelected] = useState<string>();

	return (
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
							defaultValue={new Date().toISOString().split('T')[0]}
							name="date"
							className="bg-gray-700 rounded-lg p-3 placeholder-white"
						/>
						<select
							name="competition"
							className="bg-gray-700 rounded-lg p-3 text-white"
							defaultValue=""
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

						<div className="flex gap-4 justify-between items-center">
							<select
								defaultValue=""
								name="team1"
								className="bg-gray-700 rounded-lg p-3 placeholder-white"
							>
								<option value="" disabled>
									Home Team
								</option>
								{teams
									.filter((team) => team.competition === competitionSelected)
									.map((team) => (
										<option key={team._id} value={team.team}>
											{team.team}
										</option>
									))}
							</select>

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

							<select
								defaultValue=""
								name="team2"
								className="bg-gray-700 rounded-lg p-3 placeholder-white"
							>
								<option value="" disabled>
									Away Team
								</option>
								{teams
									.filter((team) => team.competition === competitionSelected)
									.map((team) => (
										<option key={team._id} value={team.team}>
											{team.team}
										</option>
									))}
							</select>
						</div>

						{/* <input
									type="text"
									placeholder="Favorite Player"
									name="favPlayer"
									className="bg-gray-700 rounded-lg p-3 placeholder-white"
								/> */}

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
						<button type="submit" className="px-6 py-2 bg-blue-800 rounded-lg">
							Add
						</button>
					</form>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
};

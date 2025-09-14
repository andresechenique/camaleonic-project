import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import Rating from '@/components/Register';
import { Match } from '@/interfaces';
import IconMapper from '@/components/IconMapper';
import NameMapper from '@/components/NameMapper';
import { Pencil, Trash2 } from 'lucide-react';

interface MatchItemParams {
	match: Match;
	openMatchDetail: (match: Match) => void;
}
export const MatchItem = ({ match, openMatchDetail }: MatchItemParams) => {
	return (
		<Dialog>
			<DialogTrigger>
				<div
					key={match._id}
					className="flex justify-between items-center rounded-xl p-4 border-2 border-gray-700 hover:border-blue-700 transition text-center"
					onClick={() => openMatchDetail(match)}
				>
					<p className="w-20 text-left">
						{new Date(match.date).toLocaleDateString()}
					</p>
					<p className="w-40">{match.team1}</p>
					<p className="w-8">{match.scoreTeam1}</p>
					<p className="w-8">vs</p>
					<p className="w-8">{match.scoreTeam2}</p>
					<p className="w-40">{match.team2}</p>
					<div className="hidden lg:flex items-center gap-8">
						<Rating rating={match.rating} />
						<IconMapper name={match.competition} />
					</div>
				</div>
			</DialogTrigger>
			<DialogContent className="max-w-2xl">
				<DialogHeader>{new Date(match.date).toLocaleDateString()}</DialogHeader>
				<div className="flex flex-col gap-6">
					<div className="flex items-center justify-center gap-4 text-3xl">
						<p>{match.team1}</p>
						<p>{match.scoreTeam1}</p>
						<p>vs</p>
						<p>{match.scoreTeam2}</p>
						<p>{match.team2}</p>
					</div>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<p>Rating:</p>
							<Rating rating={match.rating} />
						</div>
						<div className="flex items-center gap-2">
							<p className="text-xl font-semibold">
								<NameMapper name={match.competition} />
							</p>
							<IconMapper name={match.competition} />
						</div>
					</div>
					<div className="flex items-center justify-between">
						<button className="hover:border-blue-400 rounded-lg border-2 border-blue-600 p-2 aspect-square">
							<Pencil className="w-5 hover:text-blue-400  text-blue-600" />
						</button>
						<button className="hover:border-red-400 rounded-lg border-2 border-red-600 p-2 aspect-square">
							<Trash2 className="w-5 hover:text-red-400  text-red-600" />
						</button>
					</div>
					{/* <p>{match.where}</p> */}
					{/* {match.favPlayer && <p>{match.favPlayer}</p>} */}
				</div>
			</DialogContent>
		</Dialog>
	);
};

import { Dispatch, SetStateAction } from 'react';
//////////////////////////////////////////////////////////////
import Rating from '@/components/Rating';
import { Match } from '@/interfaces';
import IconMapper from '@/components/IconMapper';
interface MatchItemParams {
	match: Match;
	setMatchDetail: Dispatch<SetStateAction<Match | undefined>>;
}
export const MatchItem = ({ match, setMatchDetail }: MatchItemParams) => {
	return (
		<div
			key={match._id}
			className="flex justify-between items-center rounded-xl p-4 border-2 border-gray-700 hover:border-blue-700 transition text-center min-h-[84px] text-xs md:text-lg"
			onClick={() => setMatchDetail(match)}
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
				<div className="w-9 flex justify-center">
					<IconMapper name={match.competition} size={8} />
				</div>
			</div>
		</div>
	);
};

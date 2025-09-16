'use client';
import { useEffect, useState } from 'react';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import {
	Chart as ChartJS,
	ArcElement,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
	Filler,
	PointElement,
	LineElement,
} from 'chart.js';
import { useSession } from 'next-auth/react';
///////////////////////////////////////////////////////////////////////////////
import { Post, User, Todo, Photo, Topic, Match } from '@/interfaces';
import { DataService, TopicService } from '@/app/services';
import { MatchesService } from '../services/match';
import { nameMap } from '../mappers/nameMap';
import { Skeleton } from '@/components/ui/skeleton';
import Rating from '@/components/Rating';
import IconMapper from '@/components/IconMapper';

ChartJS.register(
	ArcElement,
	Tooltip,
	Legend,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	LineElement,
	Filler,
	PointElement,
);

export default function Dashboard() {
	const [matches, setMatches] = useState<Match[]>([]);
	const [posts, setPosts] = useState<Post[]>([]);
	const [topics, setTopics] = useState<Topic[]>([]);
	const [todos, setTodos] = useState<Todo[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const { data: session } = useSession();

	useEffect(() => {
		if (!session?.user.id) return;
		getMatches();
		getPosts();
		getTopics();
		getTodos();
	}, [session?.user.id]);

	const getMatches = async () => {
		setLoading(true);
		try {
			const res = await MatchesService.getMatches(new Date(), session?.user.id);
			setMatches(res);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	const getPosts = async () => {
		try {
			const res = await DataService.getPosts();
			setPosts(res);
		} catch (error) {
			console.log(error);
		}
	};

	const getTopics = async () => {
		try {
			const items = await TopicService.getTopics();
			setTopics(items);
		} catch (error) {
			console.error('Failed to fetch topics:', error);
		}
	};

	const getTodos = async () => {
		try {
			const res = await DataService.getTodos();
			setTodos(res);
		} catch (error) {
			console.log(error);
		}
	};

	const competitionCounts = matches.reduce<Record<string, number>>(
		(acc, match) => {
			acc[match.competition] = (acc[match.competition] || 0) + 1;
			return acc;
		},
		{},
	);

	const competitionLabels = Object.keys(competitionCounts).map(
		(key) => nameMap[key.toLowerCase()] || key,
	);

	const dataMatches = {
		labels: competitionLabels, // now this is an array of strings
		datasets: [
			{
				label: 'Matches per Competition',
				data: Object.values(competitionCounts),
				backgroundColor: [
					'#3f0db3',
					'#0f4ccf',
					'#79aef0',
					'#0EA5E9',
					'#0f4ccf',
				],
				borderWidth: 0,
			},
		],
	};

	const teamCounts = matches.reduce<Record<string, number>>((acc, match) => {
		acc[match.team1] = (acc[match.team1] || 0) + 1;
		acc[match.team2] = (acc[match.team2] || 0) + 1;
		return acc;
	}, {});

	const sortedEntries = Object.entries(teamCounts).sort((a, b) => b[1] - a[1]);

	const labelsTeams = sortedEntries.map(([team]) => team);
	const dataSortedTeams = sortedEntries.map(([, count]) => count);

	const dataTeams = {
		labels: labelsTeams,
		datasets: [
			{
				label: 'Matches watched',
				data: dataSortedTeams,
				backgroundColor: 'rgba(59, 130, 246, 0.5)',
				borderColor: 'rgba(59, 130, 246, 1)',
				borderWidth: 1,
			},
		],
	};

	const sortedPosts = [...posts].sort((a, b) => a.id - b.id);

	const labels = sortedPosts.map((post) => `Post ${post.id}`);
	const cumulative = sortedPosts.map((_, i) => i + 1);

	const dataPosts = {
		labels,
		datasets: [
			{
				label: 'Total Posts',
				data: cumulative,
				fill: true,
				borderColor: '#4BC0C0',
				backgroundColor: 'rgba(75, 192, 192, 0.2)',
				tension: 0.3,
			},
		],
	};

	const sortedTopics = [...topics].sort((a, b) => b.points - a.points);
	const data = sortedTopics.map((topic) => topic.points);

	const dataTopics = {
		labels: sortedTopics.map((topic) => topic.title),
		datasets: [
			{
				label: 'Interest Points',
				data,
				backgroundColor: 'rgba(59, 130, 246, 0.5)',
				borderColor: 'rgba(59, 130, 246, 1)',
				borderWidth: 1,
			},
		],
	};

	const todoStatusCounts = todos.reduce<Record<string, number>>((acc, todo) => {
		const status = todo.completed ? 'Completed' : 'Incomplete';
		acc[status] = (acc[status] || 0) + 1;
		return acc;
	}, {});

	const dataTodos = {
		labels: Object.keys(todoStatusCounts),
		datasets: [
			{
				label: 'Todos',
				data: Object.values(todoStatusCounts),
				backgroundColor: ['#06B6D4', '#1D4ED8'],
				borderWidth: 0,
			},
		],
	};

	const teams = new Set<string>();
	matches.forEach((m) => {
		teams.add(m.team1);
		teams.add(m.team2);
	});

	// total goals
	const totalGoals = matches.reduce(
		(acc, m) => acc + m.scoreTeam1 + m.scoreTeam2,
		0,
	);
	const goalsPerGame = totalGoals / matches.length;

	// avg rating
	const avgRating =
		matches.reduce((acc, m) => acc + (m.rating ?? 0), 0) / matches.length;

	// rating per competition
	const ratingsByCompetition: Record<string, { sum: number; count: number }> =
		{};
	matches.forEach((m) => {
		if (!ratingsByCompetition[m.competition]) {
			ratingsByCompetition[m.competition] = { sum: 0, count: 0 };
		}
		ratingsByCompetition[m.competition].sum += m.rating ?? 0;
		ratingsByCompetition[m.competition].count += 1;
	});
	const avgRatingPerCompetition = Object.entries(ratingsByCompetition).map(
		([comp, { sum, count }]) => ({
			competition: comp,
			avg: sum / count,
		}),
	);

	// where watched
	const whereCount: Record<string, number> = {};
	matches.forEach((m) => {
		if (m.where) {
			whereCount[m.where] = (whereCount[m.where] ?? 0) + 1;
		}
	});

	if (loading)
		return (
			<div className="col-span-12 grid grid-cols-12 gap-4 p-4">
				<Skeleton className="col-span-12 md:col-span-6 rounded-lg p-2 bg-gray-600"></Skeleton>
				<Skeleton className="col-span-12 md:col-span-6 rounded-lg p-2 bg-gray-600"></Skeleton>
				<Skeleton className="col-span-12 md:col-span-4 rounded-lg p-2 bg-gray-600"></Skeleton>
				<Skeleton className="col-span-12 md:col-span-4 rounded-lg p-2 bg-gray-600"></Skeleton>
				<Skeleton className="col-span-12 md:col-span-4 rounded-lg p-2 bg-gray-600"></Skeleton>
			</div>
		);

	return (
		<div className="col-span-12 grid grid-cols-12 gap-4 p-4">
			<div className="col-span-12 md:col-span-6 bg-gray-700 rounded-lg p-2 border border-gray-500">
				{matches.length === 0 ? (
					<p className="text-gray-400 text-center italic py-4">
						No matches yet
					</p>
				) : (
					<>
						<h2 className="p-2 text-xl mb-2">Matches Watched per Team</h2>
						<div className="max-h-80 flex justify-center py-4">
							<Bar
								data={dataTeams}
								options={{
									responsive: true,
									maintainAspectRatio: false,
									plugins: {
										legend: { display: false },
										title: { display: false, text: 'Matches Watched per Team' },
									},
									scales: {
										y: {
											beginAtZero: true,
											ticks: {
												color: '#fff',
												stepSize: 1, // ensures whole numbers only
											},
										},
										x: {
											ticks: {
												color: '#fff',
											},
										},
									},
								}}
								style={{ width: '100%', height: '100%' }}
							/>
						</div>
					</>
				)}
			</div>
			<div className="col-span-12 md:col-span-6 bg-gray-700 rounded-lg p-2 border border-gray-500">
				<h2 className="p-2 text-xl">Post over time</h2>
				<div className="max-h-80 flex justify-center py-4">
					<Line
						data={dataPosts}
						options={{
							responsive: true,
							maintainAspectRatio: false,
							plugins: {
								legend: {
									display: false,
									labels: {
										color: '#fff',
									},
								},
								title: {
									display: false,
									text: 'Cumulative Posts Over Time (by ID)',
									color: '#fff',
								},
							},
							scales: {
								x: {
									title: {
										display: true,
										text: 'Post ID (proxy for time)',
										color: '#fff',
									},
									ticks: {
										maxTicksLimit: 10,
										color: '#fff',
									},
								},
								y: {
									title: {
										display: true,
										text: 'Total Posts',
										color: '#fff',
									},
									ticks: {
										color: '#fff',
									},
								},
							},
						}}
						style={{ width: '100%', height: '100%' }}
					/>
				</div>
			</div>
			<div className="col-span-12 md:col-span-4 bg-gray-700 rounded-lg p-2 border border-gray-500">
				<h2 className="p-2 text-xl">Topics with more interest</h2>
				<div className="max-h-80 flex justify-center py-4">
					<Bar
						data={dataTopics}
						options={{
							responsive: true,
							maintainAspectRatio: false,

							plugins: {
								legend: { display: false },
								title: { display: false, text: 'Interest Points per Topic' },
							},
							scales: {
								y: {
									beginAtZero: true,
									ticks: {
										color: '#fff',
									},
								},
								x: {
									ticks: {
										color: '#fff',
									},
								},
							},
						}}
						style={{ width: '100%', height: '100%' }}
					/>
				</div>
			</div>
			<div className="col-span-12 md:col-span-4 flex flex-col gap-4">
				<div className="flex flex-col gap-2 py-4 text-sm text-gray-200 bg-gray-700 rounded-lg border border-gray-500 md:h-full">
					{matches.length === 0 ? (
						<p className="text-gray-400 text-center italic">No matches yet</p>
					) : (
						<>
							<h3 className="text-sm font-semibold text-gray-100 text-center">
								Total Watched
							</h3>

							<div className="grid grid-cols-4 gap-4 text-center">
								<div className=" py-3  ">
									<p className="text-xs text-gray-400">Teams</p>
									<p className="text-lg font-bold">{teams.size}</p>
								</div>
								<div className=" py-3 ">
									<p className="text-xs text-gray-400">Goals</p>
									<p className="text-lg font-bold">{totalGoals}</p>
								</div>
								<div className=" py-3 ">
									<p className="text-xs text-gray-400">Goals/Game</p>
									<p className="text-lg font-bold">{goalsPerGame.toFixed(2)}</p>
								</div>
								<div className=" py-3 ">
									<p className="text-xs text-gray-400">Avg Rating</p>
									<p className="text-lg font-bold">{avgRating.toFixed(2)}</p>
								</div>
							</div>
						</>
					)}
				</div>
				<div className="flex flex-col gap-8 py-4 text-sm text-gray-200 bg-gray-700 rounded-lg border border-gray-500 md:h-full">
					{matches.length === 0 ? (
						<p className="text-gray-400 text-center italic">No matches yet</p>
					) : (
						avgRatingPerCompetition.length > 0 && (
							<div>
								<h3 className="text-md font-semibold text-gray-100 mb-4 text-center">
									Rating per Competition
								</h3>
								<div className="grid grid-cols-4 gap-2 justify-center">
									{avgRatingPerCompetition.map((r) => (
										<span
											key={r.competition}
											className="col-span-2 xl:col-span-1 bg-gray-700 p-2 text-xs lg:text-md flex items-center gap-2 justify-center"
										>
											{<IconMapper name={r.competition} />}:{' '}
											<Rating rating={Number(r.avg.toFixed(0))} />
										</span>
									))}
								</div>
							</div>
						)
					)}
				</div>
				<div className="flex flex-col gap-8 py-4 text-sm text-gray-200 bg-gray-700 rounded-lg border border-gray-500 md:h-full">
					{matches.length === 0 ? (
						<p className="text-gray-400 text-center italic">No matches yet</p>
					) : (
						Object.keys(whereCount).length > 0 && (
							<div>
								<h3 className="text-md font-semibold text-gray-100 mb-4 text-center">
									Where have you watched the most games?
								</h3>
								<ul className="space-y-1 text-sm px-4">
									{Object.entries(whereCount)
										.sort((a, b) => b[1] - a[1])
										.slice(0, 1)
										.map(([place, count]) => (
											<li
												key={place}
												className="flex justify-between bg-gray-700 px-3 py-2 rounded-lg"
											>
												<span>{place}</span>
												<span className="font-bold">{count}</span>
											</li>
										))}
								</ul>
							</div>
						)
					)}
				</div>
			</div>
			<div className="col-span-12 md:col-span-4 bg-gray-700 rounded-lg p-2 border border-gray-500">
				{matches.length === 0 ? (
					<p className="text-gray-400 text-center italic py-4">
						No matches yet
					</p>
				) : (
					<>
						<h2 className="p-2 text-xl">Matches per Competition</h2>
						<div className="max-h-80 flex justify-center py-4">
							<Doughnut
								data={dataMatches}
								options={{
									maintainAspectRatio: false,
									cutout: '80%',
									plugins: {
										legend: {
											display: false,
										},
									},
								}}
								style={{ width: '100%', height: '100%' }}
							/>
						</div>
					</>
				)}
			</div>
		</div>
	);
}

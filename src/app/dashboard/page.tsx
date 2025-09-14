'use client';
import { Post, User, Todo, Photo, Topic } from '@/interfaces';
import { DataService, TopicService } from '@/app/services';
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
	const [users, setUsers] = useState<User[]>([]);
	const [posts, setPosts] = useState<Post[]>([]);
	const [topics, setTopics] = useState<Topic[]>([]);
	const [todos, setTodos] = useState<Todo[]>([]);
	const [photos, setPhotos] = useState<Photo[]>([]);

	useEffect(() => {
		getUsers();
		getPosts();
		getTopics();
		getTodos();
		getPhotos();
	}, []);

	const getUsers = async () => {
		try {
			const res = await DataService.getUsers();
			setUsers(res);
		} catch (error) {
			console.log(error);
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

	const getPhotos = async () => {
		try {
			const res = await DataService.getPhotos();
			setPhotos(res);
		} catch (error) {
			console.log(error);
		}
	};

	const cityCounts = users.reduce<Record<string, number>>((acc, user) => {
		const city = user.address?.city || 'Unknown';
		acc[city] = (acc[city] || 0) + 1;
		return acc;
	}, {});

	const dataUsers = {
		labels: Object.keys(cityCounts),
		datasets: [
			{
				label: 'Nº of Users',
				data: Object.values(cityCounts),
				backgroundColor: [
					'#3B82F6',
					'#2563EB',
					'#60A5FA',
					'#0EA5E9',
					'#06B6D4',
					'#818CF8',
					'#38BDF8',
					'#1D4ED8',
				],
				borderWidth: 0,
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

	const photosByAlbum: Record<number, Photo[]> = photos.reduce(
		(acc, photo) => {
			if (!acc[photo.albumId]) {
				acc[photo.albumId] = [];
			}
			acc[photo.albumId].push(photo);
			return acc;
		},
		{} as Record<number, Photo[]>,
	);

	return (
		<div className="col-span-12 grid grid-cols-12 gap-4 p-4">
			<div className="col-span-12 md:col-span-6 bg-gray-700 rounded-lg p-2 border border-gray-500">
				<h2 className="p-2 text-xl">Users per city</h2>
				<div className="max-h-80 flex justify-center py-4">
					<Doughnut
						data={dataUsers}
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
								legend: { display: false },
								title: {
									display: true,
									text: 'Cumulative Posts Over Time (by ID)',
								},
							},
							scales: {
								x: {
									title: { display: true, text: 'Post ID (proxy for time)' },
									ticks: { maxTicksLimit: 10 },
								},
								y: {
									title: { display: true, text: 'Total Posts' },
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
								title: { display: true, text: 'Interest Points per Topic' },
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
			<div className="col-span-12 md:col-span-4 bg-gray-700 rounded-lg p-2 border border-gray-500 ">
				<h2 className="p-2 text-xl">Todo Completion %</h2>
				<div className="min-h-[200px] flex justify-center py-4">
					<Doughnut
						data={dataTodos}
						options={{
							cutout: '60%',
							maintainAspectRatio: false,

							plugins: {
								legend: {
									display: false,
								},
							},
						}}
						style={{ width: '100%', height: '100%' }}
					/>
				</div>
			</div>
			<div className="col-span-12 md:col-span-4 bg-gray-700 rounded-lg p-2 border border-gray-500">
				<h2 className="p-2 text-xl mb-2">Posts per Album</h2>
				<div className="grid grid-cols-2 gap-2 xl:4 py-4">
					{Object.entries(photosByAlbum)
						.slice(0, 4)
						.map(([albumId, photoArray]) => {
							return (
								<div
									key={albumId}
									className="rounded-lg border border-gray-500 shadow-md p-2"
								>
									<h3 className="font-semibold mb-2 text-center">
										Album {albumId}
									</h3>
									<div className="grid grid-cols-2 lg:grid-cols-4 gap-2 justify-items-center">
										{photoArray.slice(0, 4).map((photo) => (
											<div
												key={photo.id}
												className="w-10 h-10 xl:w-14 xl:h-14 rounded overflow-hidden flex justify-items-center"
											>
												<img
													src={photo.url}
													alt={photo.title}
													className="w-full h-full object-cover rounded"
												/>
											</div>
										))}
									</div>
								</div>
							);
						})}
				</div>
			</div>
		</div>
	);
}

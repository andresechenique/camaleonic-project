import { AddMatchParams, Match } from '@/interfaces';
import axios from 'axios';

async function getMatches(date: Date | undefined, id?: string) {
	const res = await axios.get(`/api/matches?userId=${id}&date=${date}`);
	return res.data;
}

async function addMatch(params: AddMatchParams) {
	console.log(params);
	const res = await axios.post('/api/matches', params);
	return res.data;
}

async function updateMatch(params: Match) {
	const res = await axios.put(`/api/matches/${params._id}`, params);
	return res.data;
}

async function deleteMatch(id: string) {
	const res = await axios.delete(`/api/matches/${id}`);
	return res.data;
}

async function getTeams(competition?: string) {
	console.log(competition);
	const res = await axios.get(`/api/teams`);
	return res.data;
}

export const MatchesService = {
	getMatches,
	addMatch,
	updateMatch,
	deleteMatch,
	getTeams,
};

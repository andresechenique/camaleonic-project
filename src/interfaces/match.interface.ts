export interface AddMatchParams {
	date: Date;
	team1: string;
	team2: string;
	scoreTeam1: number;
	scoreTeam2: number;
	competition: string;
	favPlayer?: string;
	where: string;
	rating: number;
	createdBy?: string;
}

export interface Match {
	id: number;
	date: Date;
	team1: string;
	team2: string;
	scoreTeam1: number;
	scoreTeam2: number;
	competition: string;
	favPlayer?: string;
	where: string;
	rating: number;
	createdBy?: string;
}

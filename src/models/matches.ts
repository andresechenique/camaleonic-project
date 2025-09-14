import { model, models, Schema } from 'mongoose';

const matchSchema = new Schema({
	date: {
		type: Date,
		required: [true, 'Match date is required'],
		default: Date.now,
	},
	team1: {
		type: String,
		required: [true, 'Team 1 is required'],
		trim: true,
		minLength: [2, 'Team name must be at least 2 characters'],
		maxLength: [50, 'Team name must be at most 50 characters'],
	},
	team2: {
		type: String,
		required: [true, 'Team 2 is required'],
		trim: true,
		minLength: [2, 'Team name must be at least 2 characters'],
		maxLength: [50, 'Team name must be at most 50 characters'],
	},
	scoreTeam1: {
		type: Number,
		required: [true, 'Score for Team 1 is required'],
		min: [0, 'Score cannot be negative'],
	},
	scoreTeam2: {
		type: Number,
		required: [true, 'Score for Team 2 is required'],
		min: [0, 'Score cannot be negative'],
	},
	competition: {
		type: String,
		required: [true, 'Competition is required'],
		trim: true,
		minLength: [2, 'Competition must be at least 2 characters'],
		maxLength: [100, 'Competition must be at most 100 characters'],
	},
	favPlayer: {
		type: String,
		trim: true,
		maxLength: [100, 'Player name must be at most 100 characters'],
	},
	where: {
		type: String,
		required: [true, 'Match location is required'],
	},
	rating: {
		type: Number,
		min: [0, 'Rating cannot be negative'],
		max: [10, 'Rating must be at most 10'],
		required: [true, 'Rating is required'],
	},
	author: {
		type: String,
		required: true,
	},
});

const Match = models.Match || model('Match', matchSchema);
export default Match;

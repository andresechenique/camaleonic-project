import { model, models, Schema } from 'mongoose';

const topicSchema = new Schema({
	title: {
		type: String,
		required: [true, 'Topic title is required'],
		unique: true,
		trim: true,
		minLength: [3, 'Title must be at least 3 characters'],
		maxLength: [50, 'Title must be at most 50 characters'],
	},
	description: {
		type: String,
		required: [true, 'Topic description is required'],
		minLength: [3, 'Description must be at least 3 characters'],
		maxLength: [200, 'Description must be at most 200 characters'],
	},
	points: {
		type: Number,
		required: [true, 'Topic interest points are required'],
	},
});

const Topic = models.Topic || model('Topic', topicSchema);
export default Topic;

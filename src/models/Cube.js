const mongoose = require('mongoose');

const cubeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required.']
    },
    description: {
        type: String,
        required: [true, 'Description is required.'],
        maxlength: 1000
    },
    imageUrl: {
        type: String,
        required: [true, 'Image URL is required.'],
        validate: [/^https?:\/\//i, 'Invalid URL format.']
    },
    difficultyLvl: {
        type: Number,
        required: [true, 'Difficulty level is required.'],
        min: 1,
        max: 6
    },
    accessories: [
		{
			type: mongoose.Types.ObjectId,
			ref: 'Accessory'
		}
	],
	creatorId: {
		type: String,
		required: [true, 'Creator Id is required.']
	}
});

const Cube = mongoose.model('Cube', cubeSchema);

module.exports = Cube;
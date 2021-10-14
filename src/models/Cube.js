const mongoose = require('mongoose');

const cubeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required.'],
        minlength: [5, 'Cube name must be at least 5 characters long.'],
        validate: {
            validator: function(v) {
                return /[a-z0-9 ]/i.test(v);
            },
            message: 'Cube name can consist only of english letters, digits and white spaces.'
        }
    },
    description: {
        type: String,
        required: [true, 'Description is required.'],
        minlength: [20, 'Cube description must be at least 20 characters long.'],
        validate: {
            validator: function(v) {
                return /[a-z0-9 ]/i.test(v);
            },
            message: 'Cube description can consist only of english letters, digits and white spaces.'
        }
    },
    imageUrl: {
        type: String,
        required: [true, 'Image URL is required.'],
        validate: [/^https?:\/\//i, 'Invalid URL format.']
    },
    difficulty: {
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
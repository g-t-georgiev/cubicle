const mongoose = require('mongoose');

const accessorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required.']
    },
    description: {
        type: String,
        required: [true, 'Description is required.'],
        maxlength: 500
    },
    imageUrl: {
        type: String,
        required: [true, 'Image URL is required.'],
        validate: [/^https?:\/\//i, 'Inavalid URL format.']
    },
    // cubes: [
    //     {
    //         type: mongoose.Types.ObjectId,
    //         ref: 'Cube'
    //     }
    // ]
});

const Accessory = mongoose.model('Accessory', accessorySchema);

module.exports = Accessory;
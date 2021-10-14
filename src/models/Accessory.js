const mongoose = require('mongoose');

const accessorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required.'],
        minlength: [5, 'Accessory name must be at least 5 characters long.'],
        validate: {
            validator: function(v) {
                return /[a-z0-9 ]/i.test(v);
            },
            message: 'Accessory name can consist only of english letters, digits and white spaces.'
        }
    },
    description: {
        type: String,
        required: [true, 'Description is required.'],
        minlength: [20, 'Accessory description must be at least 20 characters long.'],
        validate: {
            validator: function(v) {
                return /[a-z0-9 ]/i.test(v);
            },
            message: 'Accessory description can consist only of english letters, digits and white spaces.'
        }
    },
    imageUrl: {
        type: String,
        required: [true, 'Image URL is required.'],
        validate: [/^https?:\/\//i, 'Inavalid URL format.']
    }
});

const Accessory = mongoose.model('Accessory', accessorySchema);

module.exports = Accessory;
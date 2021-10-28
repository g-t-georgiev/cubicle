const mongoose = require('mongoose');

const bcrypt = require('../utils/bcrypt');

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: [true, 'Username is required.'],
		minlength: [5, 'Username cannot be less than 5 characters long.'],
		validate: {
			validator: function(v) {
				return /[a-z0-9]/i.test(v);
			},
			message: 'Username can consist only of english letters and digits.'
		},
		unique: true
	},
	password: {
		type: String,
		required: [true, 'Password is required'],
		minlength: [8, 'Password cannot be less than 8 characters long.'],
		validate: {
			validator: function(v) {
				return /[a-z0-9]/i.test(v);
			},
			message: 'Password can consist only of english letters and digits.'
		}
	}
});

userSchema.pre('save', async function (next) {
	const hash = await require('bcrypt').hash(this.password, require('../config/constants').SALT);
	this.password = hash;
	next();
});

userSchema.methods.validatePassword = function (password) {
	return require('bcrypt').compare(password, this.password);
}

const User = mongoose.model('User', userSchema);

module.exports = User;
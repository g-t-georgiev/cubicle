const mongoose = require('mongoose');

const bcrypt = require('../utils/bcrypt');

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: [true, 'Username is required.'],
		minlength: [4, 'Username cannot be less than 4 characters long.']
	},
	password: {
		type: String,
		required: [true, 'Password is required'],
		minlength: [6, 'Password cannot be less than 6 characters long.']
	}
});

userSchema.pre('save', bcrypt.hashPassword);

userSchema.methods.validatePassword = function (password) {
	return bcrypt.comparePassword.call(this, password);
}

const User = mongoose.model('User', userSchema);

module.exports = User;
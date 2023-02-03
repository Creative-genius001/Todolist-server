const mongoose = require("mongoose");

const User = mongoose.model(
	"User",
	new mongoose.Schema({
		name: {
			type: String,
			required: [true, "Please enter an email"],
		},
		password: {
			type: String,
			required: [true, "Please enter a password"],
			minlength: [
				6,
				"Minimum password is 6 characters",
			],
		},
		email: {
			type: String,
			required: true,
			lowercase: true,
			unique: true,
		},
	}),
);

exports.User = User;

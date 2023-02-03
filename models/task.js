const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
	task: {
		type: String,
		required: true,
	},
	isCompleted: {
		type: Boolean,
		default: false,
	},
	createdOn: {
		type: Date,
		default: Date.now(),
	},
	modifiedOn: {
		type: Date,
		default: null,
	},
	completedOn: {
		type: Date,
		default: null,
	},
	userID: { type: String, required: true },
});

const Task = mongoose.model("Task", taskSchema);

exports.Task = Task;

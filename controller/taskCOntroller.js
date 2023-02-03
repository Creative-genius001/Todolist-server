const { Task } = require("../models/task");
const { User } = require("../models/user");

//add task to todo
exports.addTask = async (req, res, next) => {
	let task = new Task({
		task: req.body.task,
		userID: req.body.userid,
	});

	try {
		await task.save();
		res
			.status(201)
			.send("Task successfully added");
	} catch (err) {
		console.error(err);
	}
};

//delete a task
exports.deleteTask = async (req, res, next) => {
	const task = await Task.findByIdAndDelete({
		_id: req.body.id,
	})
		.then(
			res
				.status(200)
				.send("deleted successfully"),
		)
		.catch((err) => console.log(err));
};

//update a task
exports.updateTask = async (req, res, next) => {
	const taskID = req.params.id;
	const updatedTask = req.body.task;
	if (!updatedTask) {
		return;
	}
	try {
		const task = await Task.findByIdAndUpdate(
			taskID,
			{
				$set: {
					task: updatedTask,
					modifiedOn: Date.now(),
				},
			},
			{ new: true },
		);
		res
			.status(200)
			.send("succesfully updated task details!✔");
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			status: "Failed",
			message: err.message,
		});
	}
};

//view all the tasks
exports.getTasks = async (req, res) => {
	await Task.find({ userID: req.body.userid })
		.then((result) => res.send(result))
		.catch((err) => console.log(err));
};

//Complete a task
exports.completeTask = async (req, res, next) => {
	let isComplete = req.body.isCompleted;
	if (!isComplete) {
		try {
			const task = await Task.findByIdAndUpdate(
				{ _id: req.body.id },
				{
					$set: {
						isCompleted: true,
						completedOn: Date.now(),
						modifiedOn: Date.now(),
					},
				},
				{ new: true },
			);
			res
				.status(200)
				.send("succesfully completed the task");
		} catch (err) {
			console.log(err);
			return res.status(500).json({
				status: "Failed",
				message: err.message,
			});
		}
	} else {
		try {
			const task = await Task.findByIdAndUpdate(
				{ _id: req.body.id },
				{
					$set: {
						isCompleted: false,
						completedOn: Date.now(),
						modifiedOn: Date.now(),
					},
				},
				{ new: true },
			);
			res
				.status(200)
				.send("succesfully completed the task");
		} catch (err) {
			console.log(err);
			return res.status(500).json({
				status: "Failed",
				message: err.message,
			});
		}
	}
};

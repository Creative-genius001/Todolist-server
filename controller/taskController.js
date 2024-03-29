const { Task } = require("../models/task");
const { User } = require("../models/user");

//add task to todo
exports.addTask = async (req, res, next) => {
	const { task, userid } = req.body;
	let newTaskData = new Task({
		task,
		userID: userid,
	});

	try {
		await newTaskData.save();
		res.status(201).send({
			status: "Successful",
			message: "Task successfully added",
		});
	} catch (err) {
		res.status(500).send({
			error:
				"Server Error: Could not create task",
		});
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
	if (updatedTask === "" && !updatedTask) {
		res
			.status(500)
			.send({
				error: "Task cannot be an empty string",
			});
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
		console.log(task);
		res
			.status(200)
			.send("succesfully updated task details!✔");
	} catch (err) {
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
		.catch((err) => {
			res.status(500).send({
				error:
					"Server Error: Could not get tasks",
			});
		});
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

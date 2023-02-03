const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const {
	getTasks,
	deleteTask,
	completeTask,
	updateTask,
	addTask,
} = require("../controller/taskController");
const {
	requireAuth,
} = require("../middlewares/Auth");

router.post("/add", requireAuth, addTask);
router.post("/get", getTasks);
router.delete("/delete/", deleteTask);
router.put(
	"/update/:id",
	requireAuth,
	updateTask,
);
router.put(
	"/complete/",
	requireAuth,
	completeTask,
);

module.exports = router;

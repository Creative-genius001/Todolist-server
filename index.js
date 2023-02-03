const express = require("express");
const cors = require("cors");
const taskRoutes = require("./routes/task");
const userRoutes = require("./routes/user");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(
	cors({
		origin: "http://localhost:3000",
	}),
);
app.use(express.json());
app.use(taskRoutes);
app.use(userRoutes);

//database connection using mongoose
const port = 5000;

mongoose
	.connect(process.env.MONGO_DEV, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("All connections sucessful!");
	})
	.catch((err) => {
		console.log(
			"Database connection failed: unable to establish connections",
		);
		console.error((err) => err.message);
	});

app.listen(process.env.PORT || port, () => {
	console.log(
		"server is running:listening on port " + port,
	);
});

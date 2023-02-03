const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const { Task } = require("../models/task");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cookieParser());

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
	return jwt.sign(
		{ id },
		process.env.SECRET_KEY,
		{
			expiresIn: maxAge,
		},
	);
};

const handleError = (err) => {
	let errors = { email: "", password: "" };
	if (err.code === 11000) {
		errors.email =
			"that email is already registered";
		return errors;
	}
	if (
		err.message.includes(
			"account could not be created",
		)
	) {
		console.log(err);
	}
	return errors;
};

router.post("/signup", async (req, res) => {
	const { name, password, email } = req.body;

	//Check if email exists
	const check = await User.findOne({
		email: email,
	});
	if (check) {
		return res
			.status(400)
			.send({ error: "Email already exists!" });
	} else {
		//create new user
		user = new User({
			name: name,
			password: password,
			email: email,
		});

		try {
			const saltRounds = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(
				password,
				saltRounds,
			);
			await user.save();
			const token = createToken(user._id);

			res.header("x-auth-token", token);
			res.status(201).send({
				name: user.name,
				id: user._id,
				jwt: token,
				error: "",
			});
		} catch (err) {
			res.status(400).send({
				error: "Account could not be created",
			});
		}
	}
});

router.post("/login", async (req, res) => {
	const { email, password } = req.body;

	let user = await User.findOne({ email: email });
	if (!user) {
		return res.status(400).send("Not found");
	} else {
		try {
			let validateUser = await bcrypt.compare(
				password,
				user.password,
			);
			if (!validateUser) {
				res.status(400).send({
					error: "Invalid email or Password",
				});
			} else {
				const token = createToken(user._id);

				res.cookie("jwt", token, {
					httpOnly: true,
					maxAge: 1000 * maxAge,
				});

				res.header("x-auth-token", token);

				res.status(200).send({
					name: user.name,

					id: user._id,
					jwt: token,
				});
			}
		} catch (err) {
			res.status(400).send({
				error: "Incorrect email or Password!",
			});
		}
	}
});

module.exports = router;

const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
	const token = req.header("x-auth-token");

	// check json web token exists & is verified
	if (token) {
		jwt.verify(
			token,
			"this is my secret key",
			(err, decodedToken) => {
				if (err) {
					console.log(err.message);
				} else {
					next();
				}
			},
		);
	} else {
		console.log("Invalid token...");
	}
};

module.exports = { requireAuth };

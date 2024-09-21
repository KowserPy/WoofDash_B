const User = require("../models/User");
const CustomError = require("../utils/customError");
const jwt = require("jsonwebtoken");

// Middleware to check if the user is logged in
const isLogin = async (req, res, next) => {
	try {
		const token = req.cookies.token;
		console.log(token);
		console.log(req.headers);
		if (!token) {
			return next(new CustomError("token not provided", 401));
		}
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findOne({ username: decoded.username, telegramId: decoded.telegramId });
		if (!user) {
			return next(new CustomError("User not found", 401));
		}
		req.user = user;
		next();
	} catch (err) {
		return next(new CustomError("Invalid or expired access token", 401));
	}
};

const isAdmin = (req, res, next) => {
	if (req.user && req.user.role === "admin") {
		return next();
	}
	return next(new CustomError("Access denied. Admins only.", 403));
};

module.exports = { isLogin, isAdmin };

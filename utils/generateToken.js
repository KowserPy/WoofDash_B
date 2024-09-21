const jwt = require("jsonwebtoken");

const generateToken = (user) => {
	return jwt.sign({ username: user.username, role: user.role, telegramId: user.telegramId }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_SECRET_EXPIRE || "30m",
	});
};

module.exports = generateToken;

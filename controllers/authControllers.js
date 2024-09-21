const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const CustomError = require("../utils/customError");
const crypto = require("crypto");
const generateToken = require("../utils/generateToken");

const verifyTelegramData = (loginData) => {
	// console.log(loginData);
	let validateData = null;
	let user = {};

	const botToken = process.env.TELEGRAM_BOT_TOKEN;
	if (!botToken) {
		throw new Error("Missing TELEGRAM_BOT_TOKEN");
	}
	const initData = new URLSearchParams(loginData);
	initData.sort();
	const hash = initData.get("hash");
	if (!hash) {
		throw new CustomError("Missing hash in Telegram login data");
	}
	initData.delete("hash");
	// check auth date
	const authDate = initData.get("auth_date");
	const accountAgeInSeconds = Math.floor(Date.now() / 1000) - authDate;
	const accountAgeInDays = Math.floor(accountAgeInSeconds / (60 * 60 * 24));
	console.log(`The account is approximately ${accountAgeInDays} days old.`);

	if (!authDate) {
		throw new Error("Missing auth_date in Telegram login data");
	}

	const dataToCheck = [...initData.entries()].map(([key, value]) => key + "=" + value).join("\n");
	const secretKey = crypto.createHmac("sha256", "WebAppData").update(botToken).digest();
	const _hash = crypto.createHmac("sha256", secretKey).update(dataToCheck).digest("hex");

	if (hash === _hash) {
		validateData = Object.fromEntries(initData.entries());
		const userString = validateData["user"];
		if (userString) {
			try {
				user = JSON.parse(userString);
			} catch (e) {
				validateData = null;
				throw new CustomError("Error parsing user Data", 401);
			}
		} else {
			validateData = null;
			throw new CustomError("Missing user in Telegram login data", 401);
		}
	} else {
		validateData = null;
		throw new CustomError("Invalid hash", 401);
	}
	return { validateData, user };
};
// login user
exports.login = asyncHandler(async (req, res, next) => {
	const loginData = req.body;
	const { validateData, user } = verifyTelegramData(loginData.data);
	const { id, first_name, last_name, username } = user;
	const userInDB = await User.findOne({ telegramId: id });

	if (userInDB) {
		const token = await generateToken(userInDB);
		res.cookie("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			maxAge: 5 * 60 * 1000,
			sameSite: "None",
		})
			.status(200)
			.json({
				success: true,
				message: "Login successful",
				user: userInDB,
				token,
			});
	} else {
		const newUser = await User.create({ telegramId: id, first_name, last_name, username });
		const token = await generateToken(newUser);
		res.cookie("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			maxAge: 5 * 60 * 1000,
			sameSite: "None",
		})
			.status(200)
			.json({
				success: true,
				message: "Regisster successful",
				user: newUser,
				token,
			});
	}
});

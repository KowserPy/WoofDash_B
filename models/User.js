const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema(
	{
		first_name: {
			type: String,
			required: true,
		},
		last_name: {
			type: String,
			required: true,
		},
		username: {
			type: String,
			required: true,
		},
		telegramId: {
			type: Number,
			required: true,
			unique: true,
		},
		referralCode: {
			type: String,
			default: () => uuidv4().slice(0, 12),
			unique: true,
		},
		referredBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			default: null,
		},
		role: {
			type: String,
			default: "user",
			enum: ["user", "admin"],
		},
		points: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
	}
);

// Create a User model
const User = mongoose.model("User", userSchema);

module.exports = User;

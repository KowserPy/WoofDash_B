const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		category: {
			type: String,
			enum: ["twitter", "telegram", "youtube"],
			required: true,
		},
		link: {
			type: String,
			required: true,
		},
		points: {
			type: Number,
			required: true,
			default: 0,
		},
		status: {
			type: String,
			enum: ["pending", "completed"],
			default: "pending",
		},
	},
	{ timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;

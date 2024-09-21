const mongoose = require("mongoose");

const completedTaskSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
	},
	{ timestamps: true }
);

const CompletedTask = mongoose.model("CompletedTask", completedTaskSchema);
module.exports = CompletedTask;

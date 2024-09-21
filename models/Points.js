const mongoose = require("mongoose");

const pointsSchema = new mongoose.Schema(
	{
		userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the User
		taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true }, // Reference to the Task
		points: { type: Number, required: true }, // Number of points awarded
	},
	{ timestamps: true }
);

const Points = mongoose.model("Points", pointsSchema);

module.exports = Points;

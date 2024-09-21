const mongoose = require("mongoose");
const CompletedTask = require("../models/completedTasks");
const Points = require("../models/Points");
const Task = require("../models/task");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const CustomError = require("../utils/customError");

exports.completeTask = asyncHandler(async (req, res) => {
	const userId = req.user._id;
	const { taskId } = req.body;

	// Check if the task ID is provided
	if (!taskId) {
		throw new CustomError("Task ID is required", 400);
	}

	// Check if the task is already completed by this user
	const taskCompleted = await CompletedTask.findOne({ userId, taskId });
	if (taskCompleted) {
		throw new CustomError("Task already completed", 400);
	}

	// Retrieve task details
	const task = await Task.findById(taskId);
	if (!task) {
		throw new CustomError("Task not found", 404);
	}

	// Mark task as completed
	const newCompleteTask = new CompletedTask({
		userId,
		taskId,
	});
	await newCompleteTask.save();

	// Award points using the Points model
	const newPoints = new Points({
		userId,
		taskId,
		points: task.points, // Task points
	});
	await newPoints.save();

	// Recalculate user's total points by summing all entries in the Points model
	const totalPoints = await Points.aggregate([
		{ $match: { userId: new mongoose.Types.ObjectId(userId) } },
		{ $group: { _id: "$userId", totalPoints: { $sum: "$points" } } },
	]);

	// Update user's total points in the User model (optional, for quicker access)
	const user = await User.findById(userId);
	user.points = totalPoints[0]?.totalPoints || 0;
	await user.save();

	res.status(201).json({
		message: "Task completed successfully",
	});
});

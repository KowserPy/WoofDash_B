const mongoose = require("mongoose");
const CompletedTask = require("../models/completedTasks");
const Points = require("../models/Points");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const CustomError = require("../utils/customError");
const Task = require("../models/Task");

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

// Function to get completed tasks by a user
exports.getCompletedTasksByUser = asyncHandler(async (req, res) => {
	const userId = req.user._id; // Assuming user is authenticated and req.user._id exists

	// Find all completed tasks for the user
	const completedTasks = await CompletedTask.find({ userId }).populate("taskId", "title points"); // Populate taskId with task details (optional)

	// If there are no completed tasks, return an empty array
	if (!completedTasks.length) {
		return res.status(200).json({ message: "No tasks completed yet", tasks: [] });
	}

	// Extract tasks information from the completedTasks array
	const tasks = completedTasks.map((completedTask) => ({
		_id: completedTask.taskId._id,
		title: completedTask.taskId.title,
		points: completedTask.taskId.points,
		completedAt: completedTask.createdAt,
	}));

	// Return the completed tasks
	res.status(200).json({
		message: "Completed tasks retrieved successfully",
		tasks,
	});
});

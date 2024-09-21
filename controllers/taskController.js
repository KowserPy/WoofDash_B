const Task = require("../models/task");
const asyncHandler = require("../utils/asyncHandler");
const CustomError = require("../utils/customError");

// Create a new task
exports.createTask = asyncHandler(async (req, res, next) => {
	const { title, category, link, points } = req.body;

	// Validate required fields
	if (!title || !category || !link || points === undefined) {
		return next(new CustomError("All fields are required", 400));
	}

	const newTask = await Task.create({ title, category, link, points });

	res.status(201).json({
		message: "Task created successfully",
		task: newTask,
	});
});

// Get all tasks
exports.getTasks = asyncHandler(async (req, res, next) => {
	const tasks = await Task.find();

	if (!tasks.length) {
		return next(new CustomError("No tasks found", 404));
	}

	res.status(200).json(tasks);
});

// Get a task by ID
exports.getTaskById = asyncHandler(async (req, res, next) => {
	const { taskId } = req.params;

	const task = await Task.findById(taskId);

	if (!task) {
		return next(new CustomError("Task not found", 404));
	}
	res.status(200).json({
		message: "Successfully retrieved task",
		task,
	});
});

// Update a task by ID
exports.updateTask = asyncHandler(async (req, res, next) => {
	const { taskId } = req.params;
	const { title, category, link, points } = req.body;

	// Find and update the task
	const updatedTask = await Task.findByIdAndUpdate(
		taskId,
		{ title, category, link, points },
		{ new: true, runValidators: true } // Returns updated task, validates new data
	);

	if (!updatedTask) {
		return next(new CustomError("Task not found", 404));
	}

	res.status(200).json({
		message: "Task updated successfully",
		task: updatedTask,
	});
});

// Delete a task by ID
exports.deleteTask = asyncHandler(async (req, res, next) => {
	const { taskId } = req.params;

	const deletedTask = await Task.findByIdAndDelete(taskId);

	if (!deletedTask) {
		return next(new CustomError("Task not found", 404));
	}

	res.status(200).json({
		message: "Task deleted successfully",
	});
});

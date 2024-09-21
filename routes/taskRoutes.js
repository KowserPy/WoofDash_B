const express = require("express");
const { createTask, getTasks, updateTask, deleteTask, getTaskById } = require("../controllers/taskController");
const taskRoutes = express.Router();

taskRoutes.post("/tasks", createTask);
taskRoutes.get("/tasks", getTasks);
taskRoutes.get("/tasks/:taskId", getTaskById);
taskRoutes.put("/tasks/:taskId", updateTask);
taskRoutes.delete("/tasks/:taskId", deleteTask);

module.exports = taskRoutes;

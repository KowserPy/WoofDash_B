const express = require("express");
const { completeTask, getCompletedTasksByUser } = require("../controllers/completedTaskController");
const { isLogin } = require("../middlewares/authMiddleware");
const completedTaskRoutes = express.Router();

completedTaskRoutes.post("/tasks/complete", isLogin, completeTask);
completedTaskRoutes.get("/tasks/complete", isLogin, getCompletedTasksByUser);

module.exports = completedTaskRoutes;

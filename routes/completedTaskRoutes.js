const express = require("express");
const { completeTask } = require("../controllers/completedTaskController");
const { isLogin } = require("../middlewares/authMiddleware");
const completedTaskRoutes = express.Router();

completedTaskRoutes.post("/tasks/complete", isLogin, completeTask);

module.exports = completedTaskRoutes;

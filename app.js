const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");
const config = require("./config/config");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const completedTaskRoutes = require("./routes/completedTaskRoutes");

const app = express();
app.use(
	cors({
		origin: config.origin,
		credentials: true,
	})
);

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.get("/", (req, res) => {
	res.send("Welcome to the Node.js app!!!!!");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1", taskRoutes);
app.use("/api/v1", completedTaskRoutes);

// Use the global error handler
app.use(errorHandler);

module.exports = app;

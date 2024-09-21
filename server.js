const express = require("express");
const connectDB = require("./config/db");
const app = require("./app");
const config = require("./config/config");

const port = config.port;
const server = express();

// Use the app middleware and routes from app.js
server.use(app);

// Start the server
server.listen(port, () => {
	connectDB();
	console.log(`Server is running on port ${port}`);
});

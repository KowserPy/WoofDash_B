const mongoose = require("mongoose");
const config = require("./config");

// MongoDB connection using mongoose
const connectDB = async () => {
	try {
		const conn = await mongoose.connect(config.dbURL);
		console.log(`Connected to ${process.env.NODE_ENV} database`);
		console.log(`MongoDB connected: ${conn.connection.host}`);
	} catch (error) {
		console.error(`Error: ${error.message}`);
		process.exit(1); // Exit process if the connection fails
	}
};

module.exports = connectDB;

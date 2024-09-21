const CustomError = require("../utils/customError");

const handleCastErrorDB = (err) => {
	const message = `Invalid ${err.path}: ${err.value}.`;
	return new CustomError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
	const message = "Duplicate field value entered.";
	return new CustomError(message, 400);
};

const handleValidationErrorDB = (err) => {
	const errors = Object.values(err.errors).map((el) => el.message);
	const message = `Validation error: ${errors.join(". ")}`;
	return new CustomError(message, 400);
};

// Send detailed error during development
const sendErrorDev = (err, res) => {
	res.status(err.statusCode).json({
		status: err.status,
		error: err,
		message: err.message,
		stack: err.stack,
		statusCode: err.statusCode, // Include statusCode in dev mode
	});
};

// Send minimal error during production
const sendErrorProd = (err, res) => {
	// If error is operational, send a friendly error message to the client
	if (err.isOperational) {
		res.status(err.statusCode).json({
			status: err.status,
			statusCode: err.statusCode, // Include status code in response
			message: err.message,
		});
	} else {
		// Log unknown errors for debugging
		console.error("ERROR 💥", err);

		// Send a generic message to the client
		res.status(500).json({
			status: "error",
			statusCode: 500, // Include status code for unknown errors
			message: "Something went very wrong!",
		});
	}
};

// Main error handling middleware
module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || "error";

	// In development mode, send detailed error (with stack trace)
	if (process.env.NODE_ENV === "development") {
		sendErrorDev(err, res);
	} else if (process.env.NODE_ENV === "production") {
		let error = { ...err };
		error.message = err.message;

		// Handle specific database errors
		if (err.name === "CastError") error = handleCastErrorDB(error);
		if (err.code === 11000) error = handleDuplicateFieldsDB(error);
		if (err.name === "ValidationError") error = handleValidationErrorDB(error);

		// In production mode, send sanitized error
		sendErrorProd(error, res);
	}
};

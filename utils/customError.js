// utils/customError.js
class CustomError extends Error {
	constructor(message, statusCode) {
		super(message);
		this.statusCode = statusCode;
		this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
		this.isOperational = true; // Mark this error as operational

		// Capture the stack trace (helps in debugging)
		Error.captureStackTrace(this, this.constructor);
	}
}

module.exports = CustomError;

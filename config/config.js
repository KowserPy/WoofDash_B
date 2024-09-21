const dotenv = require("dotenv");
dotenv.config();

const config = {
	development: {
		dbURL: process.env.DEV_DB_URL,
		origin: process.env.DEV_ORIGIN,
		port: process.env.PORT || 3000,
	},
	production: {
		dbURL: process.env.PROD_DB_URL,
		origin: process.env.PROD_ORIGIN,
		port: process.env.PORT || 8000,
	},
};

const env = process.env.NODE_ENV || "development";
module.exports = config[env];

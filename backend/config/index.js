import dotenv from "dotenv";
dotenv.config();

export default {
	port: process.env.PORT,
	host: process.env.HOST,
	database: process.env.DATABASE,
	pagination: {
		perPageDefault: 25,
		perPageMax: 100
	},
	logger: process.env.LOGGER
}
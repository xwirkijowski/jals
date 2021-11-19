import dotenv from "dotenv";
dotenv.config();

// @todo Remove encodeURIComponent
// @todo Handle database string creation

export default {
	port: process.env.PORT,
	host: process.env.HOST,
	database: 'mongodb://'+process.env.DATABASE_USER+':'+encodeURIComponent(process.env.DATABASE_PASS)+'@'+process.env.DATABASE,
	pagination: {
		perPageDefault: 25,
		perPageMax: 100
	},
	logger: process.env.LOGGER
}
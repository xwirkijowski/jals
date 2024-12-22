import mongoose from "mongoose";
import {createClient} from "redis";

import { globalLogger as log } from "./utilities/log.js";
import InternalError from "./utilities/internalError.js";
import config from "../config.js";
import InternalWarning from "./utilities/internalWarning.js";

/**
 * System status class
 *
 * @description		Used to create a single instance meant as a single source of truth for health checks
 */
class SystemStatus {
	constructor () {
		this.db = false;
		this.redis = false;
	}

	setDB(status) {
		this.db = status;
		return this.db;
	}

	setRedis(status) {
		this.redis = status;
		return this.redis;
	}
}

// Create a System Status instance and export it
export const $S = new SystemStatus();

const setupMongo = async () => {
	mongoose.set('debug', true);

	mongoose.connection.on('connected', () => {
		$S.setDB('connected');
		log.withDomain('success','Mongoose', 'Database connection established!');
	})

	mongoose.connection.on('error', err => {
		$S.setDB('error');
		new InternalError(`Code ${err.errorResponse.code}, ${err.errorResponse.errmsg}`, undefined, 'Mongoose');
	})

	mongoose.connection.on('disconnect', e => {
		$S.setDB('disconnected');
		console.log(e);
	})

	// Attempt to connect
	try {
		$S.setDB('connecting');
		log.withDomain('info', 'Mongoose', 'Attempting to establish database connection...');

		await mongoose.connect(config.mongo.connection(), {
			heartbeatFrequencyMS: 10000,
		})
	} catch (err) {
		// Handle initial errors

		$S.setDB('error');

		if (err instanceof mongoose.Error.MongooseServerSelectionError) {
			// Error while looking for the server. Possibly server is unreachable or disabled.
			new InternalError(`Cannot connect to the database. Error type: ${err.reason.type}.`, undefined, 'Mongoose')
		} else {
			// Server is found but cannot connect.
			new InternalError(`Connection error. Code ${err.errorResponse.code}, ${err.errorResponse.errmsg}`, undefined, 'Mongoose');
		}
	}
}

export const redisClient = createClient({
	url: config.redis.connection(),
	socket: {...config.redis.socket,
		reconnectStrategy: (retries, err) => {
			$S.setRedis('connecting');

			if (retries <= config.redis.reconnectAttempts) {
				// Generate a random jitter between 0 – 200 ms:
				const jitter = Math.floor(Math.random() * 200);
				// Delay is an exponential back off, (times^2) * 50 ms, with a maximum value of 15 s:
				const delay = Math.min(Math.pow(2, retries) * 50, 15000);

				if (retries % 5 === 0) new InternalError('Cannot connect to the database. Check if the redis database is running!', false, 'Redis', false)

				new InternalWarning(`Unexpected error, attempting to connect again [${retries}, ${delay+jitter}ms]...`, undefined, 'Redis');

				return delay + jitter;
			} else {
				throw new InternalError('Reached reconnect attempts limit, shutting down!', false, 'Redis', true)
			}
		}
	}
});

const setupRedis = async (client) => {
	// Redis client has connected and is ready for operations
	client.on('ready', () => {
		$S.setRedis('connected');
		log.withDomain('success', 'Redis', 'Database connection established!');
	})

	// Redis client has encountered an error
	client.on('error', err => {
		if (err.constructor.name === 'SocketClosedUnexpectedlyError') {
			// Handled by socket.reconnectStrategy
		} else if (err.constructor.name === 'Error' && err.code === 'ECONNREFUSED' && $S.redis === 'connecting') {
			// Handled by socket.reconnectStrategy
		} else if (err.constructor.name === 'InternalError') {
			throw err;
		} else {
			$S.setRedis('error');
			new InternalError(`Code ${err.code}${err?.msg?', '+err.msg:''}`, undefined, 'Redis', true);
		}
	})

	// Attempt to connect
	try {
		$S.setRedis('connecting');
		log.withDomain('info', 'Redis', 'Attempting to establish database connection...');
		client.connect();
	} catch (err) {
		// Handle initial errors

		$S.setRedis('error');
		new InternalError(`Cannot connect to the database. Code ${err.code}.`, undefined, 'Redis')
	}

	return client;
}

export {setupMongo, setupRedis}
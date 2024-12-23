import mongoose from "mongoose";
import { createClient } from "redis";

import { globalLogger as log } from "./utilities/log.js";
import { Warning, CriticalError, FatalError } from './utilities/errors/index.js';
import { config } from "./../config.js";

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
		new CriticalError(err.errorResponse?.errmsg || err.errorResponse?.message || 'Unknown mongoose error occurred.', err.errorResponse?.code || 'UNKNOWN_MONGOOSE_ERROR', 'Mongoose', false);
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
			new FatalError(`Cannot connect to the database.`, err.reason.type, 'Mongoose', true)
		} else {
			// Server is found but cannot connect.
			new FatalError(`Connection error. ${err.errorResponse?.errmsg}`, err.errorResponse?.code, 'Mongoose', true);
		}
	}
}

export const redisClient = createClient({
	url: config.redis.connection(),
	socket: {...config.redis.socket,
		reconnectStrategy: (retries, err) => {
			if (config.redis.reconnectAttempts && retries <= config.redis.reconnectAttempts) {
				$S.setRedis('connecting');

				// Generate a random jitter between 0 – 200 ms:
				const jitter = Math.floor(Math.random() * 200);
				// Delay is an exponential back off, (times^2) * 50 ms, with a maximum value of 15 s:
				const delay = Math.min(Math.pow(2, retries) * 50, 15000);

				new Warning(`Connection lost or failed to connect, attempting again [${retries}, ${delay+jitter}ms]...`, undefined, 'Redis', false);

				return delay + jitter;
			} else {
				$S.setRedis('reconnect-limit');
				new FatalError('Reached reconnect attempts limit, shutting down!', 'REDIS_RECONNECT_LIMIT', 'Redis', true, err);
				return 0; // Can't return error since it crashes the process
			}
		}
	}
});

const setupRedis = async (config) => {
	const client = redisClient;

	// Redis client has connected and is ready for operations
	client.on('ready', () => {
		$S.setRedis('connected');
		log.withDomain('success', 'Redis', 'Database connection established!');
	})

	// Redis client has encountered an error
	client.on('error', err => {
		if ($S.redis === 'reconnect-limit') {
			// Reconnect attempt limit reached, switch to fatal status and shutdown client
			$S.setRedis('fatal');

			log.withDomain('info', 'Redis', 'Disconnecting Redis...')

			client.disconnect().then(_ => log.withDomain('success', 'Redis', 'Redis disconnected successfully!'));

			log.withDomain('info', 'Redis', 'Shutting down Redis client...')

			client.quit().then(_ => {}).catch(_ => {})

			if (client.isReady === false && client.isOpen === false) {
				log.withDomain('success', 'Redis',  'Redis client closed successfully!');
				$S.setRedis('stopped');
			}
		} else if ($S.redis === 'fatal') {
			// Ignore all errors, server shutting down
		} else {
			if (err.constructor.name === 'SocketClosedUnexpectedlyError') {
				// Handled by socket.reconnectStrategy
				// Ignore this error
			} else if (err.constructor.name === 'Error' && err.code === 'ECONNREFUSED') {
				// Handled by socket.reconnectStrategy
				// Ignore this error
			}
		}
	})

	// Catch and ignore
	client.on('connect', _ => {}); // Buggy and fires multiple times on a single connection
	client.on('reconnecting', _ => {}); // Handled by reconnectStrategy
	client.on('drain', _ => {}) // Never fired
	client.on('end', _ => {}) // Not needed

	// Attempt to connect
	try {
		$S.setRedis('connecting');
		log.withDomain('info', 'Redis', 'Attempting to establish database connection...');
		await client.connect();
	} catch (err) {
		$S.setRedis('error');
		new FatalError(`Cannot connect to the database. Code ${err.code}.`, undefined, 'Redis', err)
	}

	return client;
}

export {setupMongo, setupRedis}
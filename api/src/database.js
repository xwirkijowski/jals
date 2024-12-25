
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

/**
 * Redis block
 */

const reconnectStrategy = (retries, err) => {
	const reconnectLimit = config.redis.reconnectAttempts;

	if (reconnectLimit && retries <= reconnectLimit || !reconnectLimit) {
		// Generate a random jitter between 0 – 200 ms:
		const jitter = Math.floor(Math.random() * 200);
		// Delay is an exponential back off, (times^2) * 50 ms, with a maximum value of 15 s:
		const delay = Math.min(Math.pow(2, retries) * 50, 15000);

		// Log warning
		new Warning(`Connection lost or failed to connect, attempting again [${retries}, ${delay+jitter}ms]...`, undefined, 'Redis', false);
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

export {setupRedis}
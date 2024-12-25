import { createClient } from "redis";

import { config } from '../../../config.js';
import { globalLogger as log } from "../log.js";
import { WarningAggregator, FatalError } from '../errors/index.js';

const Warnings = new WarningAggregator('Redis')

import { $DB } from './status.js';

// Construct client
export const client = createClient({
	url: config.redis.connection(),
	socket: {
		...config.redis.socket,
		reconnectStrategy: (retries, cause) => {
			const retriesLimit = config.redis.reconnectAttempts;

			if (retriesLimit && retries <= retriesLimit || !retriesLimit) {
				$DB.setRedis('connecting').setRedisTime();

				// Generate a random jitter between 0 – 200 ms:
				const jitter = Math.floor(Math.random() * 200);
				// Delay is an exponential back off, (times^2) * 50 ms, with a maximum value of 15 s:
				const delay = Math.min(Math.pow(2, retries) * 50, 15000);

				// Construct payload
				let payload;
				if (cause.constructor.name === 'Error' && cause.code === 'ECONNREFUSED') {
					payload = [`Failed to connect, will attempt again [${retries}/${retriesLimit}, ${delay+jitter}ms]...`, 'REDIS_CONN_REFUSED', false];
				} else if (cause.constructor.name === 'SocketClosedUnexpectedlyError') {
					payload = [`Connection lost, socket closed unexpectedly, attempting to reconnect...`, 'REDIS_CONN_DROPPED', false];
				} else {
					payload = [`Connection lost, will attempt to reconnect [${retries}/${retriesLimit}, ${delay+jitter}ms]...`, 'REDIS_CONN_UNKNOWN', false];
				}
				// Log warning with payload
				Warnings.new(...payload);

				return delay + jitter;
			} else {
				$DB.setRedis('connecting-limit');
				return new FatalError('Reached reconnect attempts limit! Redis client will not attempt shutdown.', 'REDIS_RECONN_LIMIT', 'Redis', false, cause);
			}
		},
	}
})

client.connect()
	.then()
	.catch(err => {
		if (err.constructor.name === 'ReconnectStrategyError') return; // Handled somewhere else...
		else if (err.constructor.name === 'ClientClosedError') return; // Handled somewhere else...

		// Handle other errors
		console.log(err, err.constructor.name, typeof err)
		new FatalError('Error during initial Redis connection.', err.code||'UNKNOWN', 'Redis')
	});

// Connecting event, NOT connected yet
client.on('connect', () => {
	$DB.setRedis('connecting');
	log.withDomain('info', 'Redis', 'Attempting to establish Redis connection...');
})

client.on('ready', () => {
	$DB.setRedis('connected');
	log.withDomain('success', 'Redis', 'Redis connection established, open and ready!');
})

client.on('reconnecting', () => {
	// Everything handled by `reconnectStrategy` function
})

client.on('error', err => {
	if ($DB.redis === 'connecting-limit') {
		handleFatalError()
		return;
	}

	// Handle errors
	if (err.constructor.name === 'SocketClosedUnexpectedlyError') return; // Handled by `reconnectStrategy` function
	else if (err.constructor.name === 'Error' && err.code === 'ECONNREFUSED') return; // Handled by `reconnectStrategy` functionelse {
	else console.log('error', err) // Handle everything else...
})

client.on('end', err => console.log('END', err)) // Test implementation

const handleFatalError = async () => {
	Warnings.new(`Attempting to gracefully close client...`, 'REDIS_FATAL', false, {redisStatus: $DB.redis})

	await client.disconnect().catch(err => {
		if (err.constructor.name === 'ClientClosedError') log.withDomain('info', 'Redis', 'Disconnected from Redis successfully.');
		else Warnings.new('Unexpected result of \'disconnect()\'!', 'UNKNOWN', true, err);
	})

	await client.quit().catch(err => {
		if (err.constructor.name === 'ClientClosedError') {
			$DB.setRedis('closed');
			log.withDomain('info', 'Redis', 'Redis client closed successfully.');
		}
		else Warnings.new('Unexpected result of \'quit()\'!', 'UNKNOWN', true, err);
	});

	// @todo: Signal to main to shutdown GraphQL and other clients
}
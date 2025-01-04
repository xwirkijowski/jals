import {createClient, RedisClientType} from "redis";

import { config } from '../../../config';
import { globalLogger as log } from "../logging/log";
import { WarningAggregator, FatalError } from '../errors/index';

const Warnings = new WarningAggregator('Redis')

import { $CMDR } from '../commander';
import { $DB } from './status';

// Construct client
export const client: RedisClientType = createClient({
	url: config.redis.connectionString(),
	socket: {
		...config.redis.socket,
		reconnectStrategy: (retries: number, cause: Error) => {
			const retriesLimit: number|undefined = config.redis.socket.reconnectAttempts;

			if (retriesLimit && retries <= retriesLimit || !retriesLimit) {
				$DB.setRedis('connecting').setRedisTime();

				// Generate a random jitter between 0 – 200 ms:
				const jitter: number = Math.floor(Math.random() * 200);
				// Delay is an exponential back off, (times^2) * 50 ms, with a maximum value of 15 s:
				const delay: number = Math.min(Math.pow(2, retries) * 50, 15000);

				// Construct payload
				// @ts-ignore - Redis client errors contain code field but no type
				if (cause.constructor.name === 'Error' && cause?.code === 'ECONNREFUSED') {
					Warnings.new(`Failed to connect, will attempt again [${retries}/${retriesLimit}, ${delay+jitter}ms]...`, 'REDIS_CONN_REFUSED', false);
				} else if (cause.constructor.name === 'SocketClosedUnexpectedlyError') {
					Warnings.new(`Connection lost, socket closed unexpectedly, attempting to reconnect...`, 'REDIS_CONN_DROPPED', false);
				} else {
					Warnings.new(`Connection lost, will attempt to reconnect [${retries}/${retriesLimit}, ${delay+jitter}ms]...`, 'REDIS_CONN_UNKNOWN', false);
				}

				return delay + jitter;
			} else {
				$DB.setRedis('connecting-limit');
				return new FatalError('Reached reconnect attempts limit! Redis client will not attempt shutdown.', 'REDIS_RECONN_LIMIT', 'Redis', false, cause);
			}
		},
	}
})

$CMDR.applyRedisClient(client);

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
		// `connecting-limit` status is set only when reconnection attempt limit is reached
		$CMDR.shutdown('REDIS_RECONN_LIMIT'); // Initiate shutdown
		return;
	}

	// Handle errors
	if (err.constructor.name === 'SocketClosedUnexpectedlyError') return; // Handled by `reconnectStrategy` function
	else if (err.constructor.name === 'Error' && err.code === 'ECONNREFUSED') return; // Handled by `reconnectStrategy` functionelse {
	else console.log('error', err) // Handle everything else...
})

client.on('end', err => console.log('END', err)) // Test implementation
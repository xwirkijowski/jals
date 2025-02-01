import process from 'node:process';
import EventEmitter from 'events';

import {$DB, TDatabaseStatus} from "@/database/status";
import {globalLogger as log} from "./logging/log";

import {seedDatabase} from "@util/seedDatabase";
import {Warning, FatalError} from "./error";

// Types
import {IContext} from "@type/context.types";
import {ApolloServer} from "@apollo/server";
import {RedisClientType} from "redis";
import mongoose from "mongoose";

// @todo: Add docs
// @todo: Support edge cases where commander or some module is not ready to shutdown.

class Commander extends EventEmitter {
	status: string = 'not-initialized';
	DB: TDatabaseStatus;

	redis?: RedisClientType; // Redis client
	mongo?: mongoose.Connection; // MongoDB client
	server?: ApolloServer<IContext>; // GraphQL server

	constructor () {
		super();

		this.status = 'not-ready';
		this.DB = $DB;
		
		return this;
	}

	#isReady (): void {
		if (this.mongo && this.redis && this.server) {
			this.emit('ready');
			this.status = 'ready';
		}
	}

	applyMongoClient (client: mongoose.Connection): this {
		this.mongo = client;
		this.emit('applied', 'Mongo');
		this.#isReady();
		return this;
	}

	applyRedisClient (client: RedisClientType): this {
		this.redis = client;
		this.emit('applied', 'Redis');
		this.#isReady();
		return this;
	}

	applyServer(server: ApolloServer<IContext>): this {
		this.server = server;
		this.emit('applied', 'Apollo');
		this.#isReady();
		return this;
	};

	async #closeServer (): Promise<boolean> {
		if (!this.server) throw new FatalError('Cannot close GraphQL server, no server on commander instance!', 'CMDR_CLOSE_SERVER_FAILED', 'Commander', true);

		new Warning('Attempting to gracefully shutdown GraphQL server...', 'APOLLO_STOP', 'Apollo', false);

		await this.server.stop();

		// @ts-ignore - It is available
		if (this.server.internals.state.phase === 'stopped') {
			log.withDomain('info', 'Apollo', 'GraphQL server stopped successfully.');
			return true;
		} else {
			new Warning('Failed to stop GraphQL server!', 'UNKNOWN', 'Apollo', true);
			return false;
		}
	}
	
	async #closeRedis (): Promise<boolean> {
		if (!this.redis) throw new FatalError('Cannot close Redis client, no client on commander instance!', 'CMDR_CLOSE_REDIS_FAILED', 'Commander', true);

		new Warning(`Attempting to gracefully close client...`, 'REDIS_STOP', 'Redis', false, {redisStatus: this.DB.redis})

		const disconnect = await this.redis.disconnect().catch(err => {
			if (err.constructor.name === 'ClientClosedError') {
					log.withDomain('info', 'Redis', 'Disconnected from Redis successfully.');
				return true;
			} else {
				new Warning('Unexpected result of \'disconnect()\'!', 'UNKNOWN', 'Redis', true, err);
				return false;
			}
		})

		const quit = await this.redis.quit().catch(err => {
			if (err.constructor.name === 'ClientClosedError') {
				this.DB.setRedis('closed');
				log.withDomain('info', 'Redis', 'Redis client closed successfully.');
				return true;
			} else {
				new Warning('Unexpected result of \'quit()\'!', 'UNKNOWN', 'Redis', true, err);
				return false;
			}
		});

		return (disconnect === true && quit === true);
	}

	async #closeMongo (): Promise<boolean> {
		if (!this.mongo) throw new FatalError('Cannot close MongoDB client, no client on commander instance!', 'CMDR_CLOSE_MONGO_FAILED', 'Commander', true);

		new Warning(`Attempting to gracefully close client...`, 'MONGO_STOP', 'Mongo', false, {mongoStatus: this.DB.mongo})

		await this.mongo.close();

		if (this.mongo.readyState === 0) {
			this.DB.setMongo('closed');
			log.withDomain('info', 'Mongo', 'MongoDB client closed successfully.');
			return true;
		} else {
			new Warning('Failed to stop MongoDB client!', 'UNKNOWN', 'Mongo', true);
			return false;
		}
	}

	async shutdown (cause: string): Promise<void> {
		// @todo Add pooling if commander not ready
		if (this.status !== 'ready') throw new FatalError('Cannot initiate graceful shutdown! Commander not ready!', 'CMDR_NOT_READY', 'Commander', true);

		console.error(`\x1b[1m\x1b[31m[\x1b[33mSHUTDOWN-SHUTDOWN-SHUTDOWN\x1b[31m] Received shutdown signal, cause: ${cause}`);

		this.emit('shutdown');

		// Step 1 — Stop listening for new connections and start wind down
		const stopServer = await this.#closeServer()
		// Step 2 — Stop Redis client
		const closeRedis = await this.#closeRedis();
		// Step 3 — Stop MongoDB client
		const closeMongo = await this.#closeMongo();

		if (stopServer && closeRedis && closeMongo) {
			log.success('Graceful shutdown complete! Goodbye.')

			process.exitCode = 1;
		}
	}
}

export type TCommander = InstanceType<typeof Commander>;

export const $CMDR = new Commander();

$CMDR.on('applied', (arg) => log.withDomain('log', 'Commander', `Applied ${arg} to commander instance`))
$CMDR.on('ready', () => log.withDomain('success', 'Commander', 'Commander ready!'));

// Seed database with hardcoded admin user
$CMDR.once('ready', async () => await seedDatabase());
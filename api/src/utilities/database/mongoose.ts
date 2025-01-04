import mongoose from "mongoose";

import {ConfigType} from "../../types/config.types";

import { globalLogger as log } from "../logging/log";
import {CriticalError, FatalError, Warning} from '../errors/index';

import { $DB } from './status';
import { $CMDR } from '../commander';

export const setupMongo = async (config: ConfigType) => {
	mongoose.set('debug', (config.server.env === 'development'));

	// Set up listeners

	mongoose.connection.on('connecting', () => {
		$DB.setMongo('connecting');
		log.withDomain('info', 'Mongo', 'Attempting to establish MongoDB connection...');
	})

	mongoose.connection.on('connected', () => {
		$DB.setMongo('connected');
		log.withDomain('info', 'Mongo', 'Connected to MongoDB...');
	})

	mongoose.connection.on('open', () => {
		// If this is set, there was a loss of connection
		if ($DB.mongoTime) {
			const time = ((performance.now() - ($DB.getMongoTime() as number)) / 1000).toFixed(2);
			log.withDomain('success', 'Mongo', `MongoDB connection restored, open and ready! Outage lasted ${time}s.`);
		} else {
			log.withDomain('success', 'Mongo', 'MongoDB connection established, open and ready!');
		}
	})

	mongoose.connection.on('reconnected', () => {
		$DB.setMongo('connected');
		log.withDomain('success', 'Mongo', 'Reconnected to MongoDB...');
	})

	mongoose.connection.on('disconnecting', () => {
		$DB.setMongo('disconnecting');
		log.withDomain('info', 'Mongo', 'Disconnecting from MongoDB...');
	})

	mongoose.connection.on('disconnected', () => {
		// Set status and time to start tracking outage
		$DB.setMongo('disconnected').setMongoTime();
		//new CriticalError('Disconnected from MongoDB!', 'MONGO_CONN_LOST', 'Mongo', false)
		log.withDomain('info', 'Mongo', 'Disconnected from MongoDB.');
	})

	mongoose.connection.on('closed', () => {
		$DB.setMongo('closed');
		log.withDomain('info', 'Mongo', 'Mongoose client closed successfully.');
	})

	mongoose.connection.on('error', err => {
		$DB.setMongo('error');
		handleError(err, 'event');
	})

	// Connection
	await mongoose.connect(config.mongo.connectionString(), {
		heartbeatFrequencyMS: 5000,
	}).catch(err => {
		$DB.setMongo('error');
		handleError(err, 'initial');
	})

	// @todo Reconnect strategy
}

$CMDR.applyMongoClient(mongoose.connection);

// @todo Identify specific `err` types
const handleError = (err: any, origin: string) => {
	console.trace($DB.mongo, origin, err)

	if (origin === 'initial') {
		if (err.constructor.name === 'MongooseServerSelectionError') {
			new Warning('Failed to connect, will attempt again...', 'REDIS_CONN_REFUSED', 'Mongo')
		} else {
			new FatalError('Error during initial MongoDB connection. Attempting to try again...', err.code||'UNKNOWN', 'Mongo', err)
		}
	} else {
		if (err.constructor.name === 'MongooseServerSelectionError') {
			new CriticalError('Cannot connect to the MongoDB server!', 'REDIS_CONN_UNKNOWN', 'Mongo')
		} else {
			new CriticalError(`Unexpected MongoDB error occured!`, 'UNKNOWN', 'Mongo', err);
		}
	}

}

import mongoose from "mongoose";

import { globalLogger as log } from "../utilities/log.js";
import { CriticalError, FatalError } from '../utilities/errors/index.js';

import { $DB } from './status.js';

export const setupMongo = async (config) => {
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
			const time = ((performance.now() - $DB.getMongoTime()) / 1000).toFixed(2);
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
		new CriticalError('Disconnected from MongoDB!', 'MONGO_CONN_LOST', 'Mongo', false)
	})

	mongoose.connection.on('closed', () => {
		$DB.setMongo('closed');
		log.withDomain('info', 'Mongo', 'Mongoose client closed.');
	})

	mongoose.connection.on('error', err => {
		$DB.setMongo('error');
		handleError(err, 'event');
	})

	// Connection
	await mongoose.connect(config.mongo.connection(), {
		heartbeatFrequencyMS: 5000,
	}).catch(err => {
		$DB.setMongo('error');
		handleError(err, 'initial');
	})
}

const handleError = (err, origin) => {
	console.trace(origin, err)

	if (origin === 'initial') {
		new CriticalError('Error during initial MongoDB connection', err.code||'UNKNOWN', 'Mongo')
	} else {
		new CriticalError(`MongoDB error. ${err.errorResponse?.errmsg}`, err.errorResponse?.code, 'Mongoose');
	}

}

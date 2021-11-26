import { config } from './config';

import {ApolloServer} from "apollo-server";
import mongoose from "mongoose";
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";

import log from './util/logger';
import helpers from './util/helpers';
import { schema, models } from './src';

log.info('Establishing database connection...')
mongoose.Promise = global.Promise;
mongoose.connect(config.database).then(() => {
	mongoose.set('debug', config.debug); //@todo Remove debug before release
	log.success('Database connection established!')

	// Construct GraphQL server instance
	const server = new ApolloServer({
		schema,
		context: ({}) => {
			const pagination = config.pagination;

			return { pagination, helpers };
		},
		dataSources: () => {
			return {
				link: models.link,
				click: models.click
			}
		}
	});

	log.info("Starting GraphQL server...")
	server.listen({ port: config.port }).then(({url}) => {
		log.success(`GraphQL server started, listening on ${url}`);
	}, () => {
		log.error("Cannot start GraphQL server, shutting down...");
		process.exit(1);
	});
}, () => {
	log.error('Cannot establish database connection, shutting down...');
	process.exit(1);
});

Sentry.init({
	dsn: "https://1a8c737b791d40b3b2df0f27cd07b82f@o1074830.ingest.sentry.io/6074725",
	tracesSampleRate: 1.0,
});

const transaction = Sentry.startTransaction({
	op: "test",
	name: "My First Test Transaction",
});

setTimeout(() => {
	try {
		foo();
	} catch (e) {
		Sentry.captureException(e);
	} finally {
		transaction.finish();
	}
}, 99);
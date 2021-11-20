import { config } from './config';

import {ApolloServer} from "apollo-server";
import mongoose from "mongoose";

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
import config from './config';

import {ApolloServer} from "apollo-server";
import mongoose from "mongoose";

import log from './util/logger';
import helpers from './util/helpers';
import { schema, models } from './src';

const about = {
	version: process.env.npm_package_version,
	name: process.env.npm_package_name,
	description: process.env.npm_package_description
}

// Startup messages
log.info('---')
log.info(`Starting ${about.name} v${about.version}`);
if (about.description) log.info(about.description);
log.info('---')

log.info('Establishing database connection...')
mongoose.Promise = global.Promise;
mongoose.connect(config.database).then(() => {
	mongoose.set('debug', true); //@todo Remove debug before release
	log.success('Database connection established!')

	// Construct GraphQL server instance
	const server = new ApolloServer({
		schema,
		context: ({}) => {
			const globals = {
				host: config.host
			}
			const pagination = config.pagination;

			return { globals, pagination, helpers };
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
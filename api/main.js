// Import logger
import { globalLogger as log } from './src/utilities/log.js';

// Load configuration
import { config } from "./config.js";

// Import database configuration and status
import { setupMongo, redisClient, setupRedis, $S } from './src/database.js';

// Import dependencies
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { ulid } from 'ulid';

// Import telemetry counters (requests, warnings, errors)
import Counters from './src/utilities/telemetryCounters.js';

// Import middleware
import { telemetryPlugin } from "./src/middleware/telemetryPlugin.js";
import { extensionsPlugin } from "./src/middleware/extensionsPlugin.js";

// Import final schema
import schema from './src/schema.js';

// Import data models
import clickModel from './src/models/click.model.js';
import linkModel from "./src/models/link.model.js";
import userModel from './src/models/user.model.js';

// Import services
import { service as AuthService } from "./src/services/auth/index.js";

// Setup Redis client
await setupRedis(redisClient);

// Setup mongoose database connection
await setupMongo();

// Construct Apollo server instance
const server = new ApolloServer({
	schema,
	plugins: [
		telemetryPlugin(),
		extensionsPlugin()
	],
	includeStacktraceInErrorResponses: (config.server.env === 'development'),
	introspection: (config.server.env === 'development')
})

export const stopServer = async () => {
	log.critical('Stopping server...')

	// Disconnect databases

	return server.stop();
}

// Statistics collection
const statistics = {
	timeStartup: new Date(),
	counters: Counters,
}

// Launch the Apollo server
const { url } = await startStandaloneServer(server, {
	listen: {
		port: config.server.port,
		host: config.server.host
	},
	context: async ({req}) => {
		statistics.counters.increment('requests');

		const telemetryRequest = {
			requestId: ulid(),
			requestPerformance: performance.now(),
			requestTimestamp: new Date(),
		}

		// @todo Rate limit, max depth, complexity
		// @todo Add check for client app to prevent direct use.

		const session = await AuthService.handleSession(req, telemetryRequest.requestId);

		return {
			session,
			req,
			pagination: config.server.pagination,
			models: {
				user: userModel,
				link: linkModel,
				click: clickModel,
			},
			services: {
				auth: AuthService,
			},
			internal: {
				...telemetryRequest,
				statistics,
			},
			systemStatus: $S,
		}
	},
	cors: {
		origin: ['https://sandbox.embed.apollographql.com', `${config.server.protocol}://${config.server.host}:${config.server.port}`],
		credentials: true
	},
})

log.success(`Ready at ${url}, running in ${config.server.env.toLowerCase()} environment...`);
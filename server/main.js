// Import dependencies
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { ulid } from 'ulid';

// Error statistics counters
import { getCounter as warningCounter } from './src/utilities/internalWarning.js';
import { getCounter as errorCounter } from './src/utilities/internalError.js';

// Import middleware
import { extensionsPlugin } from "./src/middleware/extensionsPlugin.js";

// Load configuration
import config from "./config.js";

// Import database configuration and status
import { setupMongo, redisClient, setupRedis, $S } from './src/database.js';

// Import logger
import { globalLogger as log } from './src/utilities/log.js';

// Import final schema
import schema from './src/schema.js';

// Import data models
import clickModel from './src/models/click.model.js';
import linkModel from "./src/models/link.model.js";
import userModel from './src/models/user.model.js';
import sessionModel from "./src/models/session.model.js";

// Import services
import { service as AuthService } from "./src/services/auth/index.js";

// Setup Redis client
setupRedis(redisClient);
export {redisClient};

// Setup mongoose database connection
await setupMongo();

// Construct Apollo server instance
const server = new ApolloServer({
	schema,
	plugins: [extensionsPlugin()],
	includeStacktraceInErrorResponses: (config.server.env === 'development'),
	introspection: (config.server.env === 'development')
})

// Statistics collection
const statistics = {
	timeStartup: new Date(),
	requestCount: 0,
	warningCount: warningCounter,
	errorCount: errorCounter,
}

// Launch the Apollo server
const { url } = await startStandaloneServer(server, {
	listen: {
		port: config.server.port,
		host: config.server.host
	},
	context: async ({req, }) => {
		statistics.requestCount++;

		const telemetryStart = performance.now(); // Request processing start
		const timestampStart = new Date();
		const requestId = ulid(); // Internal correlation / request ID

		// @todo Rate limit, max depth, complexity
		// @todo Add check for client app to prevent direct use.

		//const session = await handleSession(req);

		return {
			//session,
			req,
			models: {
				user: userModel,
				session: sessionModel,
				link: linkModel,
				click: clickModel,
			},
			services: {
				auth: AuthService,
			},
			internal: {
				telemetryStart,
				timestampStart,
				requestId,
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
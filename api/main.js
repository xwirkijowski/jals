// Import logger
import { globalLogger as log } from './src/utilities/log.js';

// Load configuration
import { config } from "./config.js";

// Load process commander
import { $CMDR } from './src/utilities/commander.js';

// Import database configuration and status
import { $DB } from './src/utilities/database/status.js';
import { setupMongo } from "./src/utilities/database/mongoose.js";

// Setup mongoose database connection
await setupMongo(config);

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
import { AuthService } from "./src/services/auth/service.js";

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

$CMDR.applyServer(server)

// Statistics collection
const statistics = {
	timeStartup: new Date(),
	counters: Counters,
}

// Services
const services = {
	auth: new AuthService(config),
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

		const session = await services.auth.handleSession(req, telemetryRequest.requestId);

		return {
			session,
			req,
			pagination: config.server.pagination,
			models: {
				user: userModel,
				link: linkModel,
				click: clickModel,
			},
			services,
			internal: {
				...telemetryRequest,
				statistics,
			},
			systemStatus: $DB,
		}
	},
	cors: {
		origin: ['https://sandbox.embed.apollographql.com', `${config.server.protocol}://${config.server.host}:${config.server.port}`],
		credentials: true
	},
})

log.success(`Ready at ${url}, running in ${config.server.env.toLowerCase()} environment...`);
// Import logger
import { globalLogger as log } from './src/utilities/log';

// Load configuration
import { config } from "./config";

// Load process commander
import { $CMDR } from './src/utilities/commander';

// Import database configuration and status
import { $DB } from './src/utilities/database/status';
import { setupMongo } from "./src/utilities/database/mongoose";

// Setup mongoose database connection
await setupMongo(config);

// Import dependencies
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { ulid } from 'ulid';
import * as Sentry from '@sentry/node';

// Import telemetry counters (requests, warnings, errors)
import Counters from './src/utilities/telemetryCounters';

// Import middleware
import { telemetryPlugin } from "./src/middleware/telemetryPlugin";
import { extensionsPlugin } from "./src/middleware/extensionsPlugin";

// Import final schema
import schema from './src/schema';

// Import data models
import clickModel from './src/models/click.model';
import linkModel from "./src/models/link.model";
import userModel from './src/models/user.model';

// Import services
import { AuthService } from "./src/services/auth/service";

// Types
import {ContextInterface} from "./src/types/context.types";

// Construct Apollo server instance
const server = new ApolloServer<ContextInterface>({
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
	auth: new AuthService(),
}

// Sentry.io
Sentry.init({
	dsn: config.secrets?.sentry,
	enabled: !!(config.secrets.sentry),
	integrations: [],
	tracesSampleRate: 1.0, //  Capture 100% of the transactions
	environment: config.server.env
});

// Launch the Apollo server
const { url } = await startStandaloneServer(server, {
	listen: {
		port: config.server.port,
		host: config.server.host
	},
	context: async ({req}): Promise<ContextInterface> => {
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
	/* @todo Migrate to Express.js
	cors: {
		origin: ['https://sandbox.embed.apollographql.com', `${config.server.protocol}://${config.server.host}:${config.server.port}`],
		credentials: true
	},
	*/
});

log.success(`Ready at ${url}, running in ${config.server.env.toLowerCase()} environment...`);
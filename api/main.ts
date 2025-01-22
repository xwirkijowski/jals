// Import logger
import { globalLogger as log } from '@util/logging/log';

// Load configuration
import { config } from "@config";

// Load process commander
import { $CMDR } from '@util/commander';

// Import database configuration and status
import { $DB } from '@/database/status';
import { setupMongo } from "@/database/mongoose";

// Setup mongoose database connection
await setupMongo(config);

// Import dependencies
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { ulid } from 'ulid';

// Import telemetry counters (requests, warnings, errors)
import Counters from '@util/telemetryCounters';

// Import middleware
import { telemetryPlugin } from "@plugin/telemetry.plugin";
import { extensionsPlugin } from "@plugin/extensions.plugin";

// Import final schema
import schema from '@/schema.js';

// Import data models
import clickModel from '@model/click.model';
import linkModel from '@model/link.model';
import userModel from '@model/user.model';

// Import services
import { $AuthService } from "@service/auth/service";
import { $MailService } from "@service/mail/service";

// Types
import { IContext } from "@type/context.types";

// Construct Apollo server instance
const server = new ApolloServer<IContext>({
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
	auth: $AuthService,
	mail: $MailService,
}

// Launch the Apollo server
const { url } = await startStandaloneServer(server, {
	listen: {
		port: config.server.port,
		host: config.server.host
	},
	context: async ({req, res}): Promise<IContext> => {
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
			res,
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
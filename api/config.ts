import { WarningAggregator, ErrorAggregator, CriticalError, FatalError } from "./src/utilities/errors";
import { globalLogger as log } from "./src/utilities/log";

const Warnings = new WarningAggregator('Config');
const Errors = new ErrorAggregator('Config');

interface ConnectionStringBuilder {
    (): string
}

type ConfigType = {
    server: {
        port: number
        host: string
        protocol: string
        env: string
        pagination: {
            perPageDefault: number
            perPageMax: number
        }
    }
    redis: {
        host: string
        port: number
        db?: string
        user?: string
        password?: string
        string?: string
        connectionString: ConnectionStringBuilder
        socket: {
            connectTimeout: number
            reconnectAttempts: number|undefined
        }
    }
    mongo: {
        host: string
        port: number
        db: string
        user: string
        password: string
        opts?: string
        string?: string
        connectionString: ConnectionStringBuilder
    }
};

// Defaults
const defaults = {
    server: {
        port: 4000,
        host: '127.0.0.1',
        protocol: "http",
        env: 'development',
        pagination: { // @todo Implement as a configuration option
            perPageDefault: 25,
            perPageMax: 100,
        },
    },
    redis: {
        host: '127.0.0.1',
        port: 6379,
        socket: {
            reconnectAttempts: 5, // 20
            connectTimeout: 0, // 10 s
        },
    },
    mongo: {

    }
};

// Load configuration from environment variables
log.withDomain('info', 'Config', 'Loading configuration...');

// Stage 1 - Check variables
log.withDomain('info', 'Config', 'Checking environment variables...')

// Server block
!process.env?.SERVER_PORT && Warnings.new(`No SERVER_PORT specified, using default ${defaults.server.port}`, 'SERVER_PORT_DEFAULT');
!process.env?.SERVER_HOST && Warnings.new(`No SERVER_HOST specified, using default ${defaults.server.host}`, 'SERVER_HOST_DEFAULT');
!process.env?.NODE_ENV && Warnings.new(`No NODE_ENV specified, using default ${defaults.server.env}`, 'ENV_DEFAULT');

// Redis block
!process.env?.REDIS_HOST && Warnings.new(`No REDIS_HOST specified, using default ${defaults.redis.host}`, 'REDIS_HOST_DEFAULT');
!process.env?.REDIS_PORT && Warnings.new(`No REDIS_PORT specified, using default ${defaults.redis.port}`, 'REDIS_PORT_DEFAULT');
!process.env?.REDIS_DB && Warnings.new('No REDIS_DB specified', 'REDIS_DB_MISSING');
!process.env?.REDIS_USER && Warnings.new('No REDIS_USER specified', 'REDIS_USER_MISSING');
process.env?.REDIS_USER && !process.env?.REDIS_PASS&& Warnings.new('REDIS_USER specified but no REDIS_PASSWORD, access to database may be limited', 'REDIS_PARTIAL_CREDENTIALS');

// Mongo block
!process.env?.MONGO_HOST && Errors.add(new FatalError('No MONGO_HOST specified, no access to database!', 'MONGO_HOST_MISSING', undefined, true));
!process.env?.MONGO_PORT && Errors.add(new FatalError('No MONGO_PORT specified, no access to database!', 'MONGO_PORT_MISSING', undefined, true));
!process.env?.MONGO_DB && Errors.add(new FatalError('No MONGO_DB specified, no database to access!', 'MONGO_DB_MISSING', undefined, true));
!process.env?.MONGO_USER && Errors.add(new FatalError('No MONGO_USER specified, unsecure database access is forbidden!', 'MONGO_USER_MISSING', undefined, true));
!process.env?.MONGO_PASS && Errors.add(new FatalError('No MONGO_PASS specified, unsecure database access is forbidden!', 'MONGO_PASS_MISSING', undefined, true));

// Check for errors
if (Errors.errorCount > 0) {
    log.withDomain('fatal', 'config', 'Fatal error during configuration loading! Cannot start application.')
    console.error(Errors.errors)
    process.exit(1)
}

// Stage 2 - Build configuration object
log.withDomain('info', 'Config', 'Building configuration object...')

const config: ConfigType = {
    server: {
        host: process.env?.SERVER_HOST ?? defaults.server.host,
        port: Number(process.env?.SERVER_PORT) ?? defaults.server.port,
        protocol: process.env?.SERVER_PROTO ?? defaults.server.protocol,
        env: process.env?.NODE_ENV?.toLowerCase() ?? defaults.server.env,
        pagination: defaults.server.pagination, // @todo Implement environmental variables or json
    },
    redis: {
        host: process.env?.REDIS_HOST ?? defaults.redis.host,
        port: Number(process.env?.REDIS_PORT) ?? defaults.redis.port,
        db: process.env?.REDIS_DB,
        user: process.env?.REDIS_USER,
        password: process.env?.REDIS_PASSWORD,
        string: process.env.REDIS_STRING,
        connectionString: function(): string {
            if (this.string) {
                log.std('Using Redis connection string');
                return this.string;
            }

            if (this.password) if (/(:\|\/\|\?\|#\|\[\|]\|@)/.test(this.password)) this.password = encodeURIComponent(this.password);

            const userString = (this.user) ? `${this.user}:${this.password}@` : '';

            return `redis://${(userString)}${this.host}:${this.port}${this.db?'/'+this.db:''}`
        },
        socket: defaults.redis.socket, //@todo Implement environmental variables or json
    },
    mongo: {
        host: process.env?.MONGO_HOST as string,
        port: Number(process.env?.MONGO_PORT) as number,
        db: process.env?.MONGO_DB as string,
        user: process.env?.MONGO_USER as string,
        password: process.env?.MONGO_PASSWORD as string,
        opts: process.env?.MONGO_OPTS,
        string: process.env?.MONGO_STRING as string,
        connectionString: function(): string {
            if (this.string) {
                log.std('Using MongoDB connection string');
                return this.string;
            }

            if (/(:\|\/\|\?\|#\|\[\|]\|@)/.test(this.password)) this.password = encodeURIComponent(this.password);

            const userString = (this.user) ? `${this.user}:${this.password}@` : '';

            return `mongodb://${(userString)}${this.host}:${this.port}/${this.db}${this.opts||''}`
        },
    },
};

log.withDomain('success', 'Config', 'Configuration loaded');

export {config};
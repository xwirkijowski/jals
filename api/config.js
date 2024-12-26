import { WarningAggregator, ErrorAggregator, CriticalError, FatalError } from "./src/utilities/errors/index.js";
import { globalLogger as log } from "./src/utilities/log.js";

const Warnings = new WarningAggregator('Config');
const Errors = new ErrorAggregator('Config');

// Defaults
const defaults = {
    server: {
        port: 4000,
        host: undefined,
        protocol: "http",
        env: 'development',
        pagination: { // @todo Implement as a configuration option
            perPageDefault: 25,
            perPageMax: 100
        },
    },
    redis: {
        port: 6379,
        reconnectAttempts: 5, // 20
    },
}

// Load configuration from environment variables
log.withDomain('info', 'Config', 'Loading configuration...');

const config = {}

// Server configuration block
config.server = {
    port: process.env?.SERVER_PORT ?? defaults.server.port,
    host: process.env?.SERVER_HOST ?? defaults.server.host,
    protocol: process.env?.SERVER_PROTO ?? defaults.server.protocol,
    env: process.env?.NODE_ENV.toLowerCase() ?? defaults.server.env
}

!process.env?.SERVER_PORT && Warnings.new(`No SERVER_PORT specified, using default ${defaults.server.port}`, 'SERVER_PORT_DEFAULT');
!process.env?.SERVER_HOST && Warnings.new(`No SERVER_HOST specified, using default ${defaults.server.host}`, 'SERVER_HOST_DEFAULT');
!process.env?.NODE_ENV && Warnings.new(`No NODE_ENV specified, using default ${defaults.server.env}`, 'ENV_DEFAULT');

// Redis configuration block

config.redis = {
    reconnectAttempts: defaults.redis.reconnectAttempts,
}

if (!process.env?.REDIS_STRING) {
    config.redis = {
        ...config.redis,
        host: process.env?.REDIS_HOST ?? null,
        port: Number(process.env?.REDIS_PORT) ?? defaults.redis.port,
        db: process.env?.REDIS_DB ?? null,
        user: process.env?.REDIS_USER ?? null,
        password: process.env?.REDIS_PASSWORD ?? null,

    };

    !config.redis.host && Warnings.new('No REDIS_HOST specified, sessions will not be available without a Redis database', 'REDIS_HOST_MISSING');
    !process.env?.REDIS_PORT && Warnings.new(`No REDIS_PORT specified, using default ${defaults.redis.port}`, 'REDIS_PORT_DEFAULT');
    !config.redis.db && Warnings.new('No REDIS_DB specified', 'REDIS_DB_MISSING');
    !config.redis.user && Warnings.new('No REDIS_USER specified', 'REDIS_USER_MISSING');
    config.redis.user && !config.redis.password && Warnings.new('REDIS_USER specified but no REDIS_PASSWORD, access to database may be limited', 'REDIS_PASSWORD_MISSING')
} else {
    config.redis = {
        ...config.redis,
        string: process.env.REDIS_STRING
    }

    log.std('Using Redis connection string');
}

config.redis.socket = {
    connectTimeout: 0, // 10 s
}

config.redis.connection = () => {
    if (process.env.REDIS_STRING) return process.env.REDIS_STRING;

    if (/(:\|\/\|\?\|#\|\[\|]\|@)/.test(config.redis.password)) config.redis.password = encodeURIComponent(config.redis.password);
    const userString = (config.redis.user) ? `${config.redis.user}:${config.redis.password}@` : '';

    return `redis://${(userString)}${config.redis.host}:${config.redis.port}${config.redis.db?'/'+config.redis.db:''}`
}

// Mongoose configuration block
if (!process.env.MONGO_STRING) {
    config.mongo = {
        host: process.env?.MONGO_HOST ?? null,
        port: Number(process.env?.MONGO_PORT) ?? null,
        db: process.env?.MONGO_DB ?? null,
        user: process.env?.MONGO_USER ?? null,
        password: process.env?.MONGO_PASSWORD ?? null,
        opts: process.env?.MONGO_OPTS ?? null
    };

    !config.mongo.host && Errors.add(new FatalError('No MONGO_HOST specified, no access to database!', 'MONGO_HOST_MISSING', undefined, true));
    !config.mongo.port && Errors.add(new FatalError('No MONGO_PORT specified, no access to database!', 'MONGO_PORT_MISSING', undefined, true));
    !config.mongo.db && Errors.add(new FatalError('No MONGO_DB specified, no database to access!', 'MONGO_DB_MISSING', undefined, true));
    !config.mongo.user && Warnings.new('No MONGO_USER specified, access to database may be limited', 'MONGO_USER_MISSING')
    config.mongo.user && !config.mongo.password && Warnings.new('MONGO_USER specified but no MONGO_PASSWORD, access to database may be limited', 'MONGO_PASSWORD_MISSING')
} else {
    config.mongo = {
        string: process.env.MONGO_STRING
    }

    log.std('Using MongoDB connection string');
}

config.mongo.connection = () => {
    if (process.env.MONGO_STRING) return process.env.MONGO_STRING;

    if (/(:\|\/\|\?\|#\|\[\|]\|@)/.test(config.mongo.password)) config.mongo.password = encodeURIComponent(config.mongo.password);

    const userString = (config.mongo.user) ? `${config.mongo.user}:${config.mongo.password}@` : '';

    return `mongodb://${(userString)}${config.mongo.host}:${config.mongo.port}/${config.mongo.db}${config.mongo.opts||''}`
};

if (Errors.errorCount > 0) {
    log.withDomain('fatal', 'config', 'Fatal error during configuration loading! Cannot start application.')
    console.error(Errors.errors)
    process.exit(1)
}

log.withDomain('success', 'Config', 'Configuration loaded');

export {config};
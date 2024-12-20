import InternalError from './src/utilities/internalError.js';
import InternalWarning from './src/utilities/internalWarning.js';
import {globalLogger as log} from "./src/utilities/log.js";

// Load configuration from environment variables
log.info('Loading configuration...');

const config = {}

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
    },
}

// Server configuration block
config.server = {
    port: process.env?.SERVER_PORT ?? defaults.server.port,
    host: process.env?.SERVER_HOST ?? defaults.server.host,
    protocol: process.env?.SERVER_PROTO ?? defaults.server.protocol,
    env: process.env?.NODE_ENV.toLowerCase() ?? defaults.server.env
}

!process.env?.SERVER_PORT && new InternalWarning(`No SERVER_PORT specified, using default ${defaults.server.port}`);
!process.env?.SERVER_HOST && new InternalWarning(`No SERVER_HOST specified, using default ${defaults.server.host}`);
!process.env?.NODE_ENV && new InternalWarning(`No NODE_ENV specified, using default ${defaults.server.env}`);

// Redis configuration block

if (!process.env?.REDIS_STRING) {
    config.redis = {
        host: process.env?.REDIS_HOST ?? null,
        port: Number(process.env?.REDIS_PORT) ?? defaults.redis.port,
        db: process.env?.REDIS_DB ?? null,
        user: process.env?.REDIS_USER ?? null,
        password: process.env?.REDIS_PASSWORD ?? null,
    };

    !config.redis.host && new InternalWarning('No REDIS_HOST specified, sessions will not be available without a REDIS database');
    !process.env?.REDIS_PORT && new InternalWarning(`No REDIS_PORT specified, using default ${defaults.redis.port}`);
    !config.redis.db && new InternalWarning('No REDIS_DB specified');
    !config.redis.user && new InternalWarning('No REDIS_USER specified');
    config.redis.user && !config.redis.password && new InternalWarning('REDIS_USER specified but no REDIS_PASSWORD, access to database may be limited')
} else {
    config.redis = {
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

    !config.mongo.host && new InternalError('No MONGO_HOST specified, no access to database!')
    !config.mongo.port && new InternalError('No MONGO_PORT specified, no access to database!')
    !config.mongo.db && new InternalError('No MONGO_DB specified, no database to access!')
    !config.mongo.user && new InternalWarning('No MONGO_USER specified, access to database may be limited')
    config.mongo.user && !config.mongo.password && new InternalWarning('MONGO_USER specified but no MONGO_PASSWORD, access to database may be limited')
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

log.success('Configuration loaded!')

export default config;
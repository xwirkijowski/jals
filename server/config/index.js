import dotenv from "dotenv";
dotenv.config();

import log from "../util/logger";

const env = process.env;
if (!env.NODE_ENV) env.NODE_ENV = 'development';

const config = {};
config.debug = (env.NODE_ENV === 'development');

(() => {
	log.info('---')
	log.info(`Starting ${env.npm_package_name} v${env.npm_package_version} in ${env.NODE_ENV}`);
	if (env.npm_package_description) log.info(env.npm_package_description);
	log.info('---')
})();

log.info('Constructing configuration...')

config.port = env.PORT || 4000;

config.database = (() => {
	if (env.MONGOCS) return env.MONGOCS;

	let [user, pass, host, name, opts] = [
		env.DB_USER,
		env.DB_PASS,
		env.DB_HOST,
		env.DB_NAME,
		env.DB_OPTS
	]

	if (user && !pass || !user && pass) {
		log.error('Cannot construct configuration file! Check database user credentials');
		process.exit(1);
	}

	if (/(:\|\/\|\?\|#\|\[\|]\|@)/.test(pass)) pass = encodeURIComponent(pass);

	return `mongodb://${(user)?user+':'+pass+'@':''}${host}/${name}${opts}`;
})();

config.pagination = {
	perPageDefault: 25,
	perPageMax: 100
};

log.success('Configuration created successfully!')

export { config, env };
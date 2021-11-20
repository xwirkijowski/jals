import { config } from '../config';

/**
 * Logging utility
 *
 * Does nothing when logger disabled in config/.env
 *
 * @author	Sebastian Wirkijowski <sebastian@wirkijowski.dev>
 */

export default {
	info: (data, debug = false) => {
		if (config.debug && debug || !debug) console.log('\x1b[1m\x1b[36m- [INFO]    ' + data + '\x1b[0m');
	},
	help: (data, debug = false) => {
		if (config.debug && debug || !debug) console.log('\x1b[1m\x1b[35m- [HELP]    ' + data + '\x1b[0m');
	},
	warn: (data, debug = false) => {
		if (config.debug && debug || !debug) console.log('\x1b[1m\x1b[33m- [WARN]    ' + data + '\x1b[0m');
	},
	success: (data, debug = false) => {
		if (config.debug && debug || !debug) console.log('\x1b[1m\x1b[32m- [SUCCESS] ' + data + '\x1b[0m');
	},
	error: (data, debug = false) => {
		if (config.debug && debug || !debug) console.log('\x1b[1m\x1b[31m- [ERROR]   ' + data + '\x1b[0m');
	}
};
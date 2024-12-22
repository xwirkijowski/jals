import { globalLogger as log } from './../log.js';

import Counters from '../internalCounters.js';

/**
 * Warning
 *
 * The Warning class is an informal pseudo-Error that is by itself does not block any operations.
 *
 */
class Warning {
	code;
	message;
	stack;
	domain;
	payload;

	constructor(message, code, stack, domain, ...payload) {
		this.name = 'Warning'

		// Increment warnings counter
		Counters.increment('warnings');

		this.code = code;
		this.message = message;
		this.stack = (stack) ? Error.captureStackTrace(this, this.constructor) : undefined;
		this.domain = domain;
		this.payload = payload;

		// Log reported warning
		if (this.domain) {
			log.withDomain('warn', `${this.domain}`, this.code, this.message, ...this.payload, this.stack);
		} else {
			log.warn(this.code, this.message, ...this.payload, this.stack)
		}

	}
}

export {Warning};

/**
 * WarningAggregator
 *
 * Groups warnings together on per module basis. Stores warning count and a list of warning codes.
 *
 *
 */
class WarningAggregator {
	domain;
	warnings = [];
	warningCount = 0;
	warningCodes = [];

	constructor(domain) {
		this.domain = domain;
		return this;
	}

	new = (message, code, stack, payload) => {
		const warning = new Warning(message, code, stack, this.domain, payload);

		this.warningCount += 1;
		this.warnings.push(warning);
		if (!this.warningCodes.includes(warning.code)) { this.warningCodes.push(warning.code); }

		return warning;
	}

	getArray = () => this.warnings;
	getCount = () => this.warningCount;
	getCodes = () => this.warningCodes;
	setDomain = (domain) => { this.domain = domain; return this;}
	getDomain = () => this.domain;
}

export {WarningAggregator};
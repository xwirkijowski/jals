import { globalLogger as log } from '../log';

import Counters from '../telemetryCounters';

/**
 * Warning
 *
 * The Warning class is an informal pseudo-Error that is by itself does not block any operations.
 *
 */
class Warning {
	name: string = 'Warning';

	message: string;
	code?: string;
	stack?: string|void;
	domain?: string;
	payload: any[];

	constructor (message: string, code?: string, domain?: string, stack?: string, ...payload: any[]) {
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
	domain: string;
	warnings: Warning[] = [];
	warningCount: number = 0;
	warningCodes: string[] = [];

	constructor (domain: string) {
		this.domain = domain;
		return this;
	}

	new = (message: string, code?: string, stack?: string, payload?: any): Warning => {
		const warning: Warning = new Warning(message, code, this.domain, stack, payload);

		this.warningCount += 1;
		this.warnings.push(warning);
		if (warning?.code && !this.warningCodes.includes(warning.code)) { this.warningCodes.push(warning.code); }

		return warning;
	}

	getArray = (): Warning[]|[] => this.warnings;
	getCount = (): number => this.warningCount;
	getCodes = (): string[]|[] => this.warningCodes;
	setDomain = (domain: string): this => { this.domain = domain; return this;}
	getDomain = (): string|undefined => this.domain;
}

export {WarningAggregator};
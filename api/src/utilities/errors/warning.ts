import {ulid} from "ulid";
import { globalLogger as log } from '../logging/log';
import Counters from '../telemetryCounters';
import {axiomClient as axiom} from '../logging/axiom';

/**
 * Warning
 *
 * The Warning class is an informal pseudo-Error that is by itself does not block any operations.
 *
 */
export class Warning {
	name: string = 'Warning';
	warnId: string;
	message: string;
	code?: string;
	stack?: string;
	domain?: string;
	payload: any[];

	constructor (message: string, code?: string, domain?: string, stack?: string|boolean, ...payload: any[]) {
		// Increment warnings counter
		Counters.increment('warnings');

		// Set unique error ID
		this.warnId = ulid();

		this.message = message;
		this.code = code || undefined;
		this.domain = domain || undefined;

		// If stack needs a stack trace, use built-in method and ignore current constructor
		if (stack === true) Error.captureStackTrace(this, this.constructor);
		else if (!!stack && typeof stack === 'string') this.stack = stack;

		this.payload = payload;

		// Log and call reporting utilities
		this.log();
		this.axiom();
	}

	log() {
		if (this.domain) {
			log.withDomain('warn', this.domain, this.code, this.message, ...this?.payload, this.stack);
		} else {
			log['warn'](this.code, this.message, ...this?.payload, this.stack);
		}

		return this;
	}

	axiom() {
		if (axiom) {
			axiom.ingest(`error`, {
				level: 'warning',
				id: this.warnId,
				domain: this.domain||null,
				msg: this.message,
				...(this.code && {code: this.code}),
				...(this.payload && {payload: this.payload}),
				...(this.stack && {stack: this.stack}),
			})
		}
	}
}

/**
 * WarningAggregator
 *
 * Groups warnings together on per module basis. Stores warning count and a list of warning codes.
 */
export class WarningAggregator {
	domain: string;
	warnings: Warning[] = [];
	warningCount: number = 0;
	warningCodes: string[] = [];

	constructor (domain: string) {
		this.domain = domain;
		return this;
	}

	new = (message: string, code?: string, stack?: string|boolean, payload?: any): Warning => {
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

export type TWarningAggregator = InstanceType<typeof WarningAggregator>;
import * as Sentry from "@sentry/node";
import {ulid} from "ulid";

import {globalLogger as log} from "../logging/log";
import Counters from '../telemetryCounters';
import {axiomClient as axiom, dataset as AXIOM_DATASET} from '../logging/axiom';

/**
 * InternalError
 *
 * Cannot use `message` parameter to avoid conflict with Error's built-in message behavior.
 *
 * @prop	name		Internal name, corresponding to error level.
 * @prop	level		Internal level, used to select logging method.
 * @prop	code		Error code for debugging purposes and quick code lookup.
 * @prop	msg			Error message, short description, used primarily on console output and in log files.
 * @prop 	domain		Domain of concern or module that the error appeared in.
 * @prop	payload		The payload to be used on the logging function, contains additional metadata like requestId.
 * @prop	stack		Stack trace of the error's point of origin.
 */
class InternalError extends Error implements Partial<Error> {
	name: string = 'InternalError';
	level: string = 'error';
	errorId: string;
	code: string;
	msg?: string;
	domain?: string;
	stack?: string;
	payload?: any;

	constructor(msg?: string, code = 'UNKNOWN', domain?: string, stack?: string|boolean, ...payload: any[]) {
		// Call Error constructor, capture base Error details
		super();
		// Increment error counter
		Counters.increment('errors');

		// Set unique error ID
		this.errorId = ulid();

		// Assign arguments to properties
		this.code = code || 'UNKNOWN';
		this.msg = msg || undefined;
		this.domain = domain || undefined;

		// If stack needs a stack trace, use built-in method and ignore current constructor
		if (stack === true) Error.captureStackTrace(this, this.constructor);
		else if (!!stack && typeof stack === 'string') this.stack = stack;

		// Assign payload to property if is not empty
		this.payload = ((typeof payload === 'object' && Object.keys(payload).length > 0) || (Array.isArray(payload) && payload.length > 0)) ? payload : undefined;

		// Log and call reporting utilities only if used directly, let extends handle it on their own
		if (new.target.name === 'InternalError') {
			this.log();
			this.sentry();
			this.axiom();
		}

		return this;
	}

	log() {
		if (this.domain) {
			log.withDomain(this.level, this.domain, this.code, this.msg, this?.payload, {errorId: this.errorId}, this?.stack);
		} else {
			log[this.level](this.code, this.msg, this?.payload, {errorId: this.errorId}, this?.stack);
		}

		return this;
	}

	sentry() {
		Sentry.captureException(this, {
			...(!!this?.payload?.[0]?.userId && {user: {id: this.payload[0]?.userId as string}}),
			extra: {
				...(!!this?.payload?.[0]?.requestId && {requestId: this.payload[0]?.requestId as string}),
				...(!!this?.payload?.[0]?.sessionId && {sessionId: this.payload[0]?.sessionId as string}),
			},
			tags: {
				code: this.code,
				id: this.errorId,
			}
		})
	}

	axiom() {
		if (axiom) {
			axiom.ingest(AXIOM_DATASET, {
				level: this.level,
				errorId: this.errorId,
				domain: this.domain||null,
				code: this.code,
				msg: this.msg,
				...(this.payload && {payload: this.payload}),
				...(this.stack && {stack: this.stack}),
			})
		}
	}
}

export {InternalError};

class ErrorAggregator {
	domain: string;
	errors: InternalError[] = [];
	errorCount: number = 0;
	errorCodes: string[] = [];

	constructor (domain: string) {
		this.domain = domain;
		return this;
	}

	new = (message?: string, code?: string, stack?: string|boolean, payload?: any): InternalError => {
		const error = new InternalError(message, code, this.domain, stack, payload);

		this.errorCount += 1;
		this.errors.push(error);
		if (!this.errorCodes.includes(error.code)) { this.errorCodes.push(error.code); }

		return error;
	}

	add = (error: InternalError): InternalError => {
		this.errorCount += 1;
		this.errors.push(error);

		if (!this.errorCodes.includes(error.code)) { this.errorCodes.push(error.code); }

		return error;
	}

	getArray = (): InternalError[]|[] => this.errors;
	getCount = (): number => this.errorCount;
	getCodes = (): string[]|[] => this.errorCodes;
	setDomain = (domain: string): this => { this.domain = domain; return this;}
	getDomain = (): string => this.domain;
}

export {ErrorAggregator}
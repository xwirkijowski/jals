import {globalLogger as log} from "../log.js";

import Counters from '../internalCounters.js';

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
class InternalError extends Error {
	name = 'InternalError';
	level = 'error';
	code;
	msg;
	domain;
	payload;
	stack = undefined;

	constructor(msg = undefined, code = 'UNKNOWN', domain = undefined, stack = false, ...payload) {
		// Call Error constructor, capture base Error details
		super();

		// Increment error counter
		Counters.increment('errors');

		// Assign arguments to properties
		this.code = code || 'UNKNOWN';
		this.msg = msg || undefined;
		this.domain = domain || undefined;

		// If stack needs a stack trace, use built-in method and ignore current constructor

		if (stack) Error.captureStackTrace(this, this.constructor);

		// Assign payload to property if is not empty
		this.payload = ((typeof payload === 'object' && payload.keys.length > 0) || (Array.isArray(payload) && payload.length > 0)) ? payload : undefined;

		// Log only if used directly, let extends handle logging on their own
		if (new.target.name === 'InternalError') this.log();

		return this;
	}

	log() {
		if (this.domain) {
			log.withDomain(this.level, this.domain, this.code, this.msg, this?.payload, this?.stack);
		} else {
			log[this.level](this.code, this.msg, this?.payload, this?.stack);
		}

		return this;
	}
}

export {InternalError};

class ErrorAggregator {
	domain;
	errors = [];
	errorCount = 0;
	errorCodes = [];

	constructor (domain) {
		this.domain = domain;
		return this;
	}

	new = (message, code, stack, payload) => {
		const error = new InternalError(message, code, this.domain, stack, payload);

		this.errorCount += 1;
		this.errors.push(error);
		if (!this.errorCodes.includes(error.code)) { this.errorCodes.push(error.code); }

		return error;
	}

	add = (error) => {
		this.errorCount += 1;
		this.errors.push(error);

		if (!this.errorCodes.includes(error.code)) { this.errorCodes.push(error.code); }

		return error;
	}

	getArray = () => this.errors;
	getCount = () => this.errorCount;
	getCodes = () => this.errorCodes;
	setDomain = (domain) => { this.domain = domain; return this;}
	getDomain = () => this.domain;
}

export {ErrorAggregator}
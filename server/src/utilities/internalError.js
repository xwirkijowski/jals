import { globalLogger as log } from './log.js';

// Counters for telemetry
import Counters from './internalCounters.js';

/**
 * InternalError
 *
 * Handles all expected internal errors within the application.
 *
 * Logs both critical and non-critical errors.
 *
 * @prop	name		Internal name.
 * @prop	msg			The error message.
 * @prop	domain		The name of the module or domain, used in logs.
 * @prop	critical	If `true`, throw error;
 * 						if `silent`, log as critical but do not throw;
 * 						if `false`, log as error, do not throw.
 * @prop	payload		Additional payload to be attached;
 * 						handled internally by Eudoros package on logs.
 * @prop	stack		Trace to be used instead of default stack.
 */
export default class InternalError extends Error {
	name;
	msg;
	domain;
	critical;
	payload;
	stack;

	/**
	 * @param message						The error message.
	 * @param stack							Trace to be used instead of default stack.
	 * @param domain	{string}			The name of the module or domain, used in logs.
	 * @param critical	{boolean|'silent'}	If `true`, throw error;
	 * 										if `silent`, log as critical but do not throw;
	 * 										if `false`, log as error, do not throw.
	 * @param payload						Additional payload to be attached;
	 * 										handled internally by Eudoros package on logs.
	 */
	constructor(message, stack = undefined, domain = undefined, critical = true, ...payload) {
		// Capture base Error details
		super();

		// Capture stack if none provided
		if (stack === true) Error.captureStackTrace(this, this.constructor)

		// Increment error counter for current error
		Counters.increment('errors');

		// Assign properties
		this.name = 'InternalError';
		this.msg = message;
		this.domain = domain;
		this.critical = ([true, false, 'silent'].includes(critical)) ? critical : true;
		this.payload = payload;
		if (!this.stack) this.stack = stack || undefined

		// Prioritize supplied stack on logs to avoid clutter
		// If stack is not string, convert to string
		const logTrace =  this.stack || undefined;

		// Set the log level
		const logLevel = this.critical ? 'critical' : 'error';

		// Log error with Eudoros
		if (this.domain) {
			log.withDomain(logLevel, this.domain, message, ...this.payload, logTrace);
		} else {
			log[logLevel](message, ...this.payload, logTrace);
		}

		// @todo Implement Sentry.io

		if (this.critical === true) throw this; // Throw immediately
		return this; // Allow to handle error by invoker
	}
}
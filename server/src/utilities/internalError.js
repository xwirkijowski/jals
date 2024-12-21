import { globalLogger as log } from './log.js';

// Counter for telemetry
let counter = 0;
const incrementCounter = () => ++counter;
export const getCounter = () => counter;

/**
 * InternalError
 *
 * Handles all expected internal errors within the application.
 *
 * Logs both critical and non-critical errors.
 *
 * @prop	name		Internal name.
 * @prop	message		The error message.
 * @prop	domain		The name of the module or domain, used in logs.
 * @prop	critical	If `true`, throw error;
 * 						if `silent`, log as critical but do not throw;
 * 						if `false`, log as error, do not throw.
 * @prop	payload		Additional payload to be attached;
 * 						handled internally by Eudoros package on logs.
 * @prop	stack		Trace to be used instead of default stack.
 */
export default class InternalError extends Error {
	name
	message
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
		// Call `Error` constructor
		super(message.toString())

		// Increment error counter for current error
		incrementCounter();

		// Assign properties
		this.name = 'InternalError';
		this.domain = domain;
		this.critical = ([true, false, 'silent'].includes(critical)) ? critical : true;
		this.payload = payload;

		// Prioritize supplied stack on logs to avoid clutter
		// If stack is not string, convert to string
		const logTrace =  stack?.toString() || this.stack || undefined;
		//
		//	const logTrace =
		// 		? stack?.toString() || this.stack || undefined
		// 		: stack?.toString() || undefined;

		// Set the log level
		const logLevel = this.critical ? 'critical' : 'error';

		// Log error with Eudoros
		if (this.domain) {
			log.withDomain(logLevel, this.domain, this.message, ...this.payload, logTrace);
		} else {
			log[logLevel](this.message, ...this.payload, logTrace);
		}

		// @todo Implement Sentry.io

		if (this.critical === true) throw this; // Throw immediately
		return this; // Allow to handle error by invoker
	}
}
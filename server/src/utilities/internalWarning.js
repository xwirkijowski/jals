import { globalLogger as log } from './log.js';

// Counter for telemetry
let counter = 0;
const incrementCounter = () => ++counter;
export const getCounter = () => counter;

/**
 * InternalWarning
 *
 * Handles expected warnings within the application.
 * Not for error reporting.
 *
 * @prop	name		Internal name.
 * @prop	message		The error message.
 * @prop	domain		The name of the module or domain, used in logs.
 * @prop	payload		Additional payload to be attached;
 * 						handled internally by Eudoros package on logs.
 * @prop	stack		Trace to be used instead of default stack.
 */
export default class InternalWarning {
	message
	domain;
	payload;
	stack;

	/**
	 * @param message				The error message.
	 * @param stack					Trace to be used instead of default stack.
	 * @param domain	{string}	The name of the module or domain, used in logs.
	 * @param payload				Additional payload to be attached;
	 * 								handled internally by Eudoros package on logs.
	 */
	constructor(message, stack = undefined, domain = undefined, ...payload) {
		// Increment error counter for current error
		incrementCounter();

		// Assign properties
		this.name = 'InternalWarning';
		this.message = message.toString();
		this.domain = domain;
		this.payload = payload;
		this.stack = stack?.toString() || undefined;

		// Log reported warning
		if (this.domain) {
			log.withDomain('warn', `${this.domain}`, this.message, ...this.payload, this.stack);
		} else {
			log.warn(this.message, ...this.payload, this.stack)
		}

		// @todo Implement Sentry.io

		return this;
	}
}
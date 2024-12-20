import { globalLogger as log } from './log.js';

let counter = 0;

export const getCounter = () => counter;

export default class InternalError {
	message;
	domain;
	critical;
	arguments;
	trace;

	constructor(msg, trace, dom, critical = true, ...args) {
		counter++;

		[this.message, this.domain, this.critical, this.arguments, this.trace] = [msg, dom, critical, args, trace]

		// Log reported error
		if (this.domain) {
			log.withDomain(this.critical?'critical':'error', this.domain, this.message||undefined, ...this.arguments,  this.trace||undefined);
		} else {
			log[critical?'critical':'error'](this.message, ...this.arguments, this.trace||undefined)
		}

		if (this.critical === true) throw this; // Throw exception if error is critical
	}
}
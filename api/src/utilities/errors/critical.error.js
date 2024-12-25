import {InternalError} from './error.js';

class CriticalError extends InternalError {
	constructor (msg, code, domain, stack, ...payload) {
		super(msg, code, domain, stack, ...payload);

		// Set CriticalError specific data
		this.name = 'CriticalError';
		this.level = 'critical';

		// Log error
		super.log();

		// @todo: Integrate sentry.io

		return this;
	}
}

export default CriticalError;
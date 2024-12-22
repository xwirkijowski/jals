import {InternalError} from './error.js';

class CriticalError extends InternalError {
	constructor(msg, code, domain, stack, ...payload) {
		super(msg, code, domain, stack, payload);

		// Set CriticalError specific data
		this.name = 'CriticalInternalError';
		this.level = 'critical';

		super.log();

		// @todo: Integrate sentry.io

		return this;
	}
}

export default CriticalError;
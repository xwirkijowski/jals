import {InternalError} from './error.js';

class FatalError extends InternalError {
	constructor(msg, code, domain, stack, ...payload) {
		super(msg, code, domain, stack, payload);

		// Set FatalError specific data
		this.name = 'FatalInternalError';
		this.level = 'fatal';

		// Log error
		super.log();

		// @todo: Integrate sentry.io
		// @todo: Call shutdown function

		throw this;
	}
}

export default FatalError;
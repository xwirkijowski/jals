import {InternalError} from './error.js';

class FatalError extends InternalError {
	constructor (msg, code, domain, stack, ...payload) {
		super(msg, code, domain, stack, ...payload);

		// Set FatalError specific data
		this.name = 'FatalError';
		this.level = 'fatal';

		// Log error
		super.log();

		// @todo: Integrate sentry.io
		// @todo: Call shutdown function

		return this;
	}
}

export default FatalError;
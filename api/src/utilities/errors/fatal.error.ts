import {InternalError} from './error';

class FatalError extends InternalError {
	name: string;
	level: string;

	constructor (msg: string, code: string, domain?: string, stack?: string|boolean, ...payload: any[]) {
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
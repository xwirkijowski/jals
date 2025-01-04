import {InternalError} from './error';

class CriticalError extends InternalError {
	name: string = 'CriticalError';
	level: string = 'critical';

	constructor (msg: string, code: string, domain?: string, stack?: string|boolean, ...payload: any[]) {
		super(msg, code, domain, stack, ...payload);

		// Log error and call sentry
		super.log();
		super.sentry();

		return this;
	}
}

export default CriticalError;
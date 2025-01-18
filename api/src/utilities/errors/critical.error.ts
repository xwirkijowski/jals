import {InternalError} from './internal.error';

class CriticalError extends InternalError {
	name: string = 'CriticalError';
	level: string = 'critical';

	constructor (msg: string, code: string, domain?: string, stack?: string|boolean, ...payload: any[]) {
		super(msg, code, domain, stack, ...payload);

		// Log error and call sentry
		super.log();
		super.sentry();
		super.axiom();

		return this;
	}
}

export default CriticalError;
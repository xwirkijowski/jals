import {InternalError} from './error';

class CriticalError extends InternalError {
	name: string;
	level: string;

	constructor (msg: string, code: string, domain?: string, stack?: any, ...payload: any[]) {
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
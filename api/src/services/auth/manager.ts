import EventEmitter from "node:events";
import {ErrorAggregator, InternalError, TErrorAggregator} from "@util/errors/internal.error";
import {CriticalError} from "@util/error";

/**
 * Base manager class
 *
 * Handles error collection
 *
 * @Since 2.1.1
 */
export class Manager extends EventEmitter {
	errors: TErrorAggregator;
	domain: string;
	
	constructor () {
		super ();
		
		return this;
	}
	
	/**
	 * Processes supplied error.
	 *
	 * If error is a defined, expected, custom `InternalError`, do nothing and return it.
	 * If error is unexpected, wrap it into a `CriticalError` and return it.
	 *
	 * @since 2.1.1
	 *
	 * @param   error
	 * @param   add     Add to error aggregator or just return the processed error.
	 * @return  Error
	 */
	processError (error: InternalError|Error, add: boolean = true): Error {
		if (['InternalError', 'CriticalError', 'FatalError'].includes(error.name)) {
			if (add) this.errors.add(error as InternalError);
			
			return error;
		}
		
		const adaptedError: InternalError = new CriticalError(error?.message?`Unexpected error captured: ${error.message}`:'Unexpected error captured', 'UNKNOWN', this.domain, error?.stack);
		
		if (add) this.errors.add(adaptedError);
		
		return adaptedError;
	}
	
	/**
	 * Retrieve an array of errors from the error aggregator
	 *
	 * @since 2.1.1
	 *
	 * @return  InternalError[]|[]
	 */
	getErrors= (): InternalError[]|[] => this.errors.getArray();
	
	/**
	 * Retrieve error count from the error aggregator
	 *
	 * @since 2.1.1
	 *
	 * @return  number
	 */
	getErrorCount = (): number => this.errors.getCount();
}
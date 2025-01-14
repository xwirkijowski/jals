import { globalLogger as log } from "../utilities/logging/log";

export class Result {
	success: boolean;
	errors: Array<ResultError|null>;
	errorCodes: Array<string>

	constructor (result?: boolean, errors?: Array<ResultError>) {
		this.success = result||true;
		this.errors = errors||[];
		this.errorCodes = (Array.isArray(errors)) ? errors?.map(err => err.code)||[] : [];

		return this;
	}

	#pushErrorCode = (code: string): void => {
		if (!this.errorCodes.includes(code)) this.errorCodes.push(code);
	}

	hasErrors = ():boolean => {
		return (this.errors.length > 0);
	}

	addError = (
		code: string,
		path?: string,
		message?: string
	): this => {
		if (this.success) this.success = false;
		this.errors.push(new ResultError(code, path, message));
		this.#pushErrorCode(code);

		return this;
	}

	addErrorAndLog = (
		code: string,
		path: string|undefined,
		message: string|undefined,
		type: string,
		note: string,
		component?: string
	): this => {
		if (this.success) this.success = false;
		this.errors.push(new ResultError(code, path, message));
		this.#pushErrorCode(code);

		if (['request', 'audit'].includes(type)) {
			log.withDomain(type, component, `${note?note+' ':''}Code: ${code}`);
		}

		return this;
	}

	/**
	 * @description	Build and return `Result` object. Allows for additional data inclusion if .
	 *
	 * @param 		full		Boolean
	 * @param 		include		Object
	 *
	 * @returns 	{*|{result: {success: (*|boolean), errors: (*|*[])}}|{success: (*|boolean), errors: (*|*[])}}
	 */
	response = (full = true, include = {}): {result: Partial<Result>}|Partial<Result> => {
		if (this.errors.length !== 0) {
			this.success = false;
		}

		return full ? {
			result: {
				success: this.success,
				errors: this.errors,
				errorCodes: this.errorCodes
			},
			...include
		} : { success: this.success, errors: this.errors };
	}
}

export class ResultError {
	code: string;
	path?: string;
	msg?: string;

	constructor(code: string, path?: string, message?: string) {
		this.code = code;
		this.path = path || undefined;
		this.msg = message || undefined;

		return this;
	}
}

export type TResult = InstanceType<typeof Result>
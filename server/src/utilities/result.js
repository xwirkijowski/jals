import { globalLogger as log } from "./log.js";

export class Result {
	constructor (result, errors) {
		this.success = result||true;
		this.errors = errors||[];
		this.errorCodes = (Array.isArray(errors)) ? errors?.map(err => err.code)||[] : [];

		return this;
	}

	#pushErrorCode = (code) => {
		if (!this.errorCodes.includes(code)) this.errorCodes.push(code);
	}

	hasErrors = () => {
		return (this.errors.length > 0);
	}

	addError = (code, path, message) => {
		if (this.success === true) this.success = false;
		this.errors.push(new ResultError(code, path, message));
		this.#pushErrorCode(code);

		return this;
	}

	addErrorAndLog = (code, path, message, type, note, component = undefined) => { // @todo: Refactor due to new logger
		if (this.success === true) this.success = false;
		this.errors.push(new ResultError(code, path, message));
		this.#pushErrorCode(code);

		if (typeof type === 'string' && ['request', 'audit'].includes(type)) {
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
	response = (full = true, include = {}) => {
		if (this.errors.length !== 0) {
			this.success = false;
		}

		return (full === true ) ? {
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
	code;
	path;
	msg;

	constructor(code, path = undefined, message = undefined) {
		this.code = code;
		this.path = path || null;
		this.msg = message || null;

		return this;
	}
}
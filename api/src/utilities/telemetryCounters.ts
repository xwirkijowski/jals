type ValidCounter = 'warnings'|'errors'|'requests';

/**
 * TelemetryCounters
 *
 * @description Keeps track of operations, warnings and errors
 *
 * @prop	warnings	{Number}	The number of warnings.
 * @prop	errors		{Number}	The number of errors (all types).
 * @prop	requests	{Number}	The number of requests serviced.
 *
 * @prop	#validCounters	{Array<String>}	Valid `counter` argument values
 *
 * @method	increment	Increments a specified counter
 * @method	get			Retrieves a specified counter.
 */
class TelemetryCounters {
	warnings: number = 0;
	errors: number = 0;
	requests: number = 0;

	#validCounters: Array<ValidCounter> = ['warnings', 'errors', 'requests'];

	constructor () {
		return this;
	}

	increment(counter:ValidCounter):this|Error {
		if (this.#validCounters.includes(counter)) {
			this[counter]++;

			return this;
		} else {
			return new Error('increment failed');
		}
	}

	get = (counter:ValidCounter):number|Error => {
		if (this.#validCounters.includes(counter)) {
			return this[counter];
		} else {
			return new Error('Invalid counter, cannot retrieve');
		}
	}
}

export default new TelemetryCounters();

export {TelemetryCounters}
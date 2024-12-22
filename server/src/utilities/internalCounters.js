/**
 * InternalCounters
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
class InternalCounters {
	warnings = 0;
	errors = 0;
	requests = 0;

	#validCounters = ['warnings', 'errors', 'requests'];

	constructor() {
		return this;
	}

	increment(counter) {
		if (this.#validCounters.includes(counter)) {
			this[counter]++;

			return this;
		} else {
			return new Error('increment failed');
		}
	}

	get = (counter) => {
		if (this.#validCounters.includes(counter)) {
			return this[counter];
		} else {
			return new Error('Invalid counter, cannot retrieve');
		}
	}
}

export default new InternalCounters();

export {InternalCounters}
import { globalLogger as log } from './log.js';

let counter = 0;

export const getCounter = () => counter;

export default class InternalWarning {
	constructor(msg, ext, mod) {
		counter++;

		// Log reported warning
		if (mod) {
			log.withDomain('warn', `${mod}`, msg, ext);
		} else {
			log.warn(msg, ext)
		}
	}
}
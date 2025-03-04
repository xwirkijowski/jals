import {TelemetryCounters} from "@util/telemetryCounters";
import assert from "assert";

describe('TelemetryCounter Unit Tests', () => {
	const $TC = new TelemetryCounters();
	
	it('Returns 0 for all counters on initial state', () => {
		assert.equal($TC.warnings, 0);
		assert.equal($TC.errors, 0);
		assert.equal($TC.requests, 0);
	})
	
	it('Increments all counters successfully', () => {
		assert.ok($TC.increment('warnings'));
		assert.ok($TC.increment('errors'));
		assert.ok($TC.increment('requests'));
	})
})
import {globalLogger as log} from './../utilities/log.js';

export const telemetryPlugin = () => {
	return {
		requestDidStart: () => {
			return {
				didResolveSource: () => {},
				parsingDidStart: () => {},
				validationDidStart: () => {},
				didResolveOperation: () => {},
				responseForOperation: () => {},
				executionDidStart: () => {},
				didEncounterErrors: () => {},
				willSendResponse: async ({contextValue}) => {
					log.request({
						time: (performance.now() - contextValue.internal.requestPerformance).toFixed(2),
						requestId: contextValue.internal.requestId,
						timestampStart: contextValue.internal.requestTimestamp,
						timestampEnd: new Date().toISOString(),
						sessionId: contextValue.session?.sessionId,
					});
				},
			}
		}
	}
}
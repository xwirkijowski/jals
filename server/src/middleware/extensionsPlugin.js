export const extensionsPlugin = () => {
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
				willSendResponse(requestContext) {
					requestContext.response.body.singleResult = {
						...requestContext.response.body.singleResult,
						extensions: {
							...requestContext.response.body?.extensions,
							requestId: requestContext.contextValue.internal.requestId
						},
					};
				},
			}
		}
	}
};
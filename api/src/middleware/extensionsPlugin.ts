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
				willSendResponse(requestContext: any): void {
					const requestId = requestContext.contextValue.internal.requestId;

					const session = requestContext.contextValue.session;
					const sessionStatus = (session && session !== 'invalid')
						? true
						: session;

					requestContext.response.body.singleResult = {
						...requestContext.response.body.singleResult,
						extensions: {
							...requestContext.response.body?.extensions,
							requestId,
							auth: sessionStatus,
						},
					};
				},
			}
		}
	}
};
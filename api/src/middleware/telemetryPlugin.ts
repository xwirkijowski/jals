import {globalLogger as log} from '../utilities/log';
import {ApolloServerPlugin, GraphQLRequestContextWillSendResponse, GraphQLRequestListener} from "@apollo/server";
import {ContextInterface} from "../types/context.types";

export function telemetryPlugin(): ApolloServerPlugin<ContextInterface> {
	return {
		async requestDidStart(): Promise<void | GraphQLRequestListener<ContextInterface>> {
			return {
				async willSendResponse({
					contextValue
				}: {
					contextValue: GraphQLRequestContextWillSendResponse<ContextInterface>['contextValue']
				}): Promise<void> {
					log.request({
						time: (performance.now() - contextValue.internal.requestPerformance).toFixed(2),
						requestId: contextValue.internal.requestId,
						timestampStart: contextValue.internal.requestTimestamp,
						timestampEnd: new Date().toISOString(),
						...(!!(contextValue.session && contextValue.session !== 'invalid') && {sessionId: contextValue?.session?.sessionId}),
					});
				}
			}
		}
	}
}
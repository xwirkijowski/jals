import {globalLogger as log} from '../utilities/logging/log';
import {ApolloServerPlugin, GraphQLRequestContextWillSendResponse, GraphQLRequestListener} from "@apollo/server";
import {ContextInterface} from "../types/context.types";

import {axiomClient as axiom, datasetPrefix as AXIOM_PREFIX} from "../utilities/logging/axiom";
import {getUA} from "../utilities/helpers";

export function telemetryPlugin(): ApolloServerPlugin<ContextInterface> {
	return {
		async requestDidStart(): Promise<void | GraphQLRequestListener<ContextInterface>> {
			return {
				async willSendResponse({
					contextValue
				}: {
					contextValue: GraphQLRequestContextWillSendResponse<ContextInterface>['contextValue']
				}): Promise<void> {
					const data = {
						time: (performance.now() - contextValue.internal.requestPerformance).toFixed(2),
						requestId: contextValue.internal.requestId,
						timestampStart: contextValue.internal.requestTimestamp,
						timestampEnd: new Date().toISOString(),
						session: !!(contextValue.session && contextValue.session !== 'invalid') ? contextValue?.session : undefined,
					}

					axiom.ingest(`${AXIOM_PREFIX}-request`, {
						requestId: data.requestId,
						time: data.time,
						timestampStart: data.timestampStart,
						timestampEnd: data.timestampEnd,
						sessionId: data?.session?.sessionId,
						user: {
							id: data?.session?.userId,
							agent: getUA(contextValue.req),
						},
						body: (contextValue.req as any)?.body,
					})

					log.request({
						requestId: data.requestId,
						time: data.time,
						timestampStart: data.timestampStart,
						timestampEnd: data.timestampEnd,
						...(!!(data?.session) && {sessionId: data.session.sessionId}),
						user: {
							...(!!(data?.session) && {id: data.session.userId}),
							agent: getUA(contextValue.req),
						},
					});
				}
			}
		}
	}
}
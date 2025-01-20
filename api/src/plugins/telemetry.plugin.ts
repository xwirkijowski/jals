import {ApolloServerPlugin, GraphQLRequestContextWillSendResponse, GraphQLRequestListener} from "@apollo/server";
import {globalLogger as log} from '@util/logging/log';
import {IContext} from "@type/context.types";

import {axiomClient as axiom} from "@util/logging/axiom";
import {getIP, getUA} from "@util/helpers";

export function telemetryPlugin(): ApolloServerPlugin<IContext> {
	return {
		async requestDidStart(): Promise<void | GraphQLRequestListener<IContext>> {
			return {
				async willSendResponse({
					contextValue
				}: {
					contextValue: GraphQLRequestContextWillSendResponse<IContext>['contextValue']
				}): Promise<void> {
					const data = {
						time: (performance.now() - contextValue.internal.requestPerformance).toFixed(2),
						requestId: contextValue.internal.requestId,
						timestampStart: contextValue.internal.requestTimestamp,
						timestampEnd: new Date().toISOString(),
						session: !!(contextValue.session && contextValue.session !== 'invalid') ? contextValue?.session : undefined,
						userAddr: getIP(contextValue.req),
						userAgent: getUA(contextValue.req),
					}

					axiom.ingest(`request`, {
						requestId: data.requestId,
						time: data.time,
						timestampStart: data.timestampStart,
						timestampEnd: data.timestampEnd,
						sessionId: data?.session?.sessionId,
						user: {
							id: data?.session?.userId,
							agent: data.userAgent,
							addr: data.userAddr,
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
							agent: data.userAgent,
							addr: data.userAddr,
						},
					});
				}
			}
		}
	}
}
import {ApolloServerPlugin, GraphQLRequestContextWillSendResponse, GraphQLRequestListener} from "@apollo/server";
import {IContext} from "../types/context.types";

export function extensionsPlugin (): ApolloServerPlugin<IContext> {
	return {
		async requestDidStart(): Promise<void | GraphQLRequestListener<IContext>> {
			return {
				async willSendResponse(requestContext: GraphQLRequestContextWillSendResponse<IContext>): Promise<void> {
					const requestId = requestContext.contextValue.internal.requestId;

					const session = requestContext.contextValue.session;
					const sessionStatus = (session && session !== 'invalid')
						? true
						: session;

					if (requestContext.response.body.kind === 'single' && 'data' in requestContext.response.body.singleResult) {
						requestContext.response.body.singleResult = {
							...requestContext.response.body.singleResult,
							extensions: {
								requestId,
								auth: sessionStatus,
							},
						}
					}
				}
			}
		}
	}
}
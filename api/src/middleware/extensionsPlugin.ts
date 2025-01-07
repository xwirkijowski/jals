import {ApolloServerPlugin, GraphQLRequestContextWillSendResponse, GraphQLRequestListener} from "@apollo/server";
import {ContextInterface} from "../types/context.types";

export function extensionsPlugin (): ApolloServerPlugin<ContextInterface> {
	return {
		async requestDidStart(): Promise<void | GraphQLRequestListener<ContextInterface>> {
			return {
				async willSendResponse(requestContext: GraphQLRequestContextWillSendResponse<ContextInterface>): Promise<void> {
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
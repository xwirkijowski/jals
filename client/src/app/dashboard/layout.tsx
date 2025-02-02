import React from "react";

import {ApolloWrapper} from "@ctx/apollo/apollo.context";
import {LinkContextWrapper} from "@ctx/link/link.context";

export default function Layout ({children}: React.PropsWithChildren): React.ReactNode {
	return (
		<ApolloWrapper>
			<LinkContextWrapper>
				{children}
			</LinkContextWrapper>
		</ApolloWrapper>
	)
}
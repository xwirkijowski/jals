import React from "react";

import {ApolloWrapper} from "@ctx/apollo/apollo.context";

export default function Layout ({children}: React.PropsWithChildren): React.ReactNode {
	return (
		<ApolloWrapper>
			{children}
		</ApolloWrapper>
	)
}
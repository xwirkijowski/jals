"use server";

import {ReactNode} from "react";
import {redirect} from "next/navigation";

import {ApolloWrapper} from "@ctx/apollo/apollo.context";
import {getSession} from "@ctx/auth/auth.utils.server";

export default async function Layout (
	{children}: { children: ReactNode }
): Promise<ReactNode> {
	const session = await getSession();
	
	if (!session) {
		redirect('/login');
	}
	
	return (
		<ApolloWrapper>
			{children}
		</ApolloWrapper>
	)
}
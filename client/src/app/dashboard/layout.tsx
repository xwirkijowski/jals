"use server";

import React from "react";
import {redirect} from "next/navigation";

import {ApolloWrapper} from "@ctx/apollo/apollo.context";
import {getSession} from "@ctx/auth/auth.utils.server";

export default async (
	{modal, children, params}: { modal: React.ReactNode, children: React.ReactNode, params: any }
): Promise<React.ReactNode> => {
	const session = await getSession();
	
	if (!session) {
		redirect('/login');
	}
	
	return (
		<ApolloWrapper>
			{modal}
			{children}
		</ApolloWrapper>
	)
}
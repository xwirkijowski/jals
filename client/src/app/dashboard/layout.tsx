"use server";

import React from "react";
import * as motion from "motion/react-client";

import {container} from "@lib/motion/stagger.fly";

import {ApolloWrapper} from "@ctx/apollo/apollo.context";

export default async (
	{modal, children, params}: { modal: React.ReactNode, children: React.ReactNode, params: any }
): Promise<React.ReactNode> => (
	<ApolloWrapper>
		{modal}
		<motion.div variants={container}
		            initial="hidden"
		            animate="show"
		            className={"w-full flex-col flex gap-8"}>
			{children}
		</motion.div>
	</ApolloWrapper>
)
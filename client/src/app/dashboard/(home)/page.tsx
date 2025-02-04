"use server";

import React, {Suspense} from "react";
import * as motion from "motion/react-client";
import cx from "classnames";

import {container, item} from "@lib/motion/stagger.fly";

import {getUser} from "@ctx/auth/auth.utils.server";

import {LinksTable, LinksTableSkeleton} from "@comp/@dashboard/links-table";
import {H1} from "@comp/typography";

export default async function Page () {
	const user = await getUser(),
		  userName = user.email.split('@')[0];
	
	return (
		<>
			<H1 variants={item}>Hello, <span className={'text-orange-500'}>{userName}</span>!</H1>
			<motion.div variants={container}
			            className={cx("grid grid-cols-4 gap-8 flex-1 auto-rows-min")}>
				<Suspense fallback={<LinksTableSkeleton />}>
					<LinksTable />
				</Suspense>
			</motion.div>
		</>
	)
}
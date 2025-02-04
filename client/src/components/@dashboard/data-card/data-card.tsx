"use client";

import {motion} from "motion/react";

import {Card} from "@comp/card";
import {H3} from "@comp/typography";
import {container, item} from "@lib/motion/stagger.fly";

export default function DataCard({label, children, ...props}) {
	return (
		<Card {...props} contained={false}>
			<H3 variants={item}>{label}</H3>
			<motion.div variants={item} className={"w-full gap-2 flex flex-col"}>
				{children}
			</motion.div>
		</Card>
	)
}
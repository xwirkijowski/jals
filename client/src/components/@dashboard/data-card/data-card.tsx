"use client";

import {motion} from "motion/react";

import {container, item} from "@lib/motion/stagger.fly";
import {merge} from "@lib/merge";

import {Card, TCardProps} from "@comp/card";
import {H3} from "@comp/typography";

type TProps = {
	label: string
} & TCardProps

export default function DataCard({label, className, children, ...props}: TProps) {
	return (
		<Card {...props} contained={false} className={merge(className, 'justify-between')}>
			<H3 variants={item}>{label}</H3>
			<motion.div variants={item} className={"w-full gap-2 flex flex-col"}>
				{children}
			</motion.div>
		</Card>
	)
}
"use client";

import cx from "classnames";
import React from "react";
import Link from "next/link";
import {motion} from "motion/react";

import {Button} from "@comp/button";
import {H1, H2} from "@comp/typography";

import {container, item} from "@lib/motion/stagger.fly";

export const LinkNotFound = ({linkId, context}): React.ReactNode => {
	return (
		<motion.div variants={container} className={cx('flex-col gap-4 flex items-center max-w-lg w-full')}>
			<H1 variants={item} align={"center"}>404</H1>
			<H2 variants={item} align={"center"}>We couldn&apos;t find your link</H2>
			<motion.div variants={item} className={"flex text-center"}>
				<p className={"w-full px-4 py-2 bg-zinc-200 text-zinc-600 rounded-xl border border-transparent font-mono text-wrap break-words overflow-hidden"}>{linkId}</p>
			</motion.div>
			{context === 'inspect' && (
				<motion.div variants={container} className={'flex gap-4'}>
					<Link href={`/`} passHref><Button variants={item} btnType={'dark'} effects={true}>Homepage</Button></Link>
					<Link href={`/inspect`} passHref><Button variants={item} btnType={'primary'} effects={true}>Inspect another</Button></Link>
				</motion.div>
			)}
			{context === 'redirect' && (
				<motion.div variants={container} className={'flex gap-4'}>
					<Link href={`/`} passHref><Button variants={item} btnType={'primary'} effects={true}>Homepage</Button></Link>
				</motion.div>
			)}
		</motion.div>
	)
}
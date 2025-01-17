"use client";

import cx from "classnames";
import Link from "next/link";
import Button from "@comp/Button/Button";
import React from "react";
import {H1} from "@comp/Typography/H1";
import {H2} from "@comp/Typography/H2";

export const LinkNotFound = ({linkId, context}): React.ReactNode => {
	return (
		<div className="flex flex-col justify-center items-center flex-1 gap-8">
			<div className={cx('flex-col gap-4 flex items-center max-w-lg w-full')}>
				<H1 align={"center"}>404</H1>
				<H2 align={"center"}>We couldn't find your link</H2>
				<div className={"flex text-center"}>
					<p className={"w-full px-4 py-2 bg-zinc-200 text-zinc-600 rounded-xl border border-transparent font-mono text-wrap break-words overflow-hidden"}>{linkId}</p>
				</div>
				{context === 'inspect' && (
					<div className={'flex gap-4'}>
						<Link href={`/`} passHref><Button btnType={'dark'} effects={true}>Homepage</Button></Link>
						<Link href={`/inspect`} passHref><Button btnType={'primary'} effects={true}>Inspect another</Button></Link>
					</div>
				)}
				{context === 'redirect' && (
					<div className={'flex gap-4'}>
						<Link href={`/`} passHref><Button btnType={'primary'} effects={true}>Homepage</Button></Link>
					</div>
				)}
			</div>
		</div>
	)
}
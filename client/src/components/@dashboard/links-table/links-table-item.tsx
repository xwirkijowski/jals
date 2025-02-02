"use client";

import React from "react";
import Link from "next/link";

import {staggerFly} from "@lib/motion/stagger.fly";
import {staggerFade} from "@lib/motion/stagger.fade";

import {TableRow, TD} from "@comp/table";
import {Anchor} from "@comp/anchor";
import {Button, ButtonGroup} from "@comp/button";
import {DateToLocaleString} from "@comp/date-to-locale-string";
import {Badge} from "@comp/badge";

import {TLink} from "@type/data/link";

type TProps = {
	node: TLink
}

export function LinksTableItem ({node}: TProps): React.ReactNode {
	const status = node.active ? node.caution ? 'Cautioned' : 'Active' : 'Not active';
	const statusBadge = node.active ? node.caution ? 'warning' : 'success' : 'dark';
	
	return (
		<TableRow key={node.id} variants={staggerFly.container}>
			<TD className={'max-w-48'}>{node.id}</TD>
			<TD className={'max-w-48'}><Anchor href={node.target}>{node.target}</Anchor></TD>
			<TD className={'place-items-center'} ><Badge size={'sm'} badgeType={statusBadge}>{status}</Badge></TD>
			<TD className={'text-center w-0'}>{node.clickCount||'-'}</TD>
			<TD className={'text-center w-0'}>{node.flagCount||'-'}</TD>
			<TD className={'text-right'}>{node.updatedAt ? <DateToLocaleString value={node.updatedAt} /> : '-'}</TD>
			<TD className={'text-right'}><DateToLocaleString value={node.createdAt} /></TD>
			<TD className={'w-0'}>
				<ButtonGroup className={"justify-end"} joined>
					<Link passHref href={`/inspect/${node.id}`}><Button group={"start"} btnType={'theme'} size={'sm'}>Inspect</Button></Link>
					<Link passHref href={`/dashboard/${node.id}/modify`}><Button disabled group={"middle"} btnType={'theme'} size={'sm'}>Modify</Button></Link>
					<Link passHref href={`/dashboard/${node.id}/delete`}><Button disabled group={"end"} btnType={'danger'} size={'sm'}>Delete</Button></Link>
				</ButtonGroup>
			</TD>
		</TableRow>
	)
}
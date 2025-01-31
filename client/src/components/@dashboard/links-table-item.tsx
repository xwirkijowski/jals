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
			<TD variants={staggerFade.item}>
				{node.id}
			</TD>
			<TD variants={staggerFade.item}>
				<Anchor href={node.target}>{node.target}</Anchor>
			</TD>
			<TD align={'center'} variants={staggerFade.item}>
				<Badge size={'sm'} badgeType={statusBadge}>{status}</Badge>
			</TD>
			<TD width={'1%'} align={'center'} variants={staggerFade.item}>
				{node.clickCount||'-'}
			</TD>
			<TD width={'1%'} align={'center'} variants={staggerFade.item}>
				{node.flagCount||'-'}
			</TD>
			<TD align={'right'} variants={staggerFade.item}>
				{node.updatedAt ? <DateToLocaleString value={node.updatedAt} /> : '-'}
			</TD>
			<TD align={'right'} variants={staggerFade.item}>
				<DateToLocaleString value={node.createdAt} />
			</TD>
			<TD width={'1%'} align={'right'} variants={staggerFade.item}>
				<ButtonGroup joined>
					<Link passHref href={`/inspect/${node.id}`}>
						<Button group={"start"} btnType={'theme'} size={'sm'}>Inspect</Button>
					</Link>
					<Button disabled group={"middle"} btnType={'theme'} size={'sm'}>Modify</Button>
					<Button disabled group={"end"} btnType={'danger'} size={'sm'}>Delete</Button>
				</ButtonGroup>
			</TD>
		</TableRow>
	)
}
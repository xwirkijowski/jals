"use client"

import React from "react";

import {H2, P} from "@comp/typography";
import {Card, CardFooter, CardHead} from "@comp/card";
import {Table, TableHead, TableRow, TD, TH} from "@comp/table";
import {Placeholder} from "@comp/placeholder";
import {staggerFly} from "@lib/motion/stagger.fly";

type TProps = {
	mockCount?: number
}

export function LinksTableSkeleton ({mockCount = 10}): React.ReactNode {
	let i: number = 0
	const mock: Array<React.ReactNode> = [];
	
	while (i < mockCount) {
		mock.push(
			<TableRow key={i}>
				<TD><Placeholder /></TD>
				<TD><Placeholder /></TD>
				<TD><Placeholder /></TD>
				<TD><Placeholder /></TD>
				<TD><Placeholder /></TD>
				<TD><Placeholder /></TD>
				<TD><Placeholder /></TD>
				<TD><Placeholder /></TD>
			</TableRow>
		)
		i++
	}
	
	return (
		<Card structured className={"overflow-hidden !max-w-none col-span-full animate-pulse"} variants={staggerFly.container}>
			<CardHead>
				<H2><Placeholder width={'48'} /></H2>
			</CardHead>
			<Table>
				<TableHead>
					<TableRow>
						<TH><Placeholder /></TH>
						<TH><Placeholder /></TH>
						<TH><Placeholder /></TH>
						<TH><Placeholder /></TH>
						<TH><Placeholder /></TH>
						<TH><Placeholder /></TH>
						<TH><Placeholder /></TH>
						<TH><Placeholder /></TH>
					</TableRow>
				</TableHead>
				<tbody>
					{mock}
				</tbody>
			</Table>
			<CardFooter>
				<Placeholder width={'96'} />
				<Placeholder width={'32'} />
			</CardFooter>
		</Card>
	)
}

"use client"

import {ReactNode} from "react";

import {container} from "@lib/motion/stagger.fly";

import {Card, CardFooter, CardHead} from "@comp/card";
import {H2} from "@comp/typography";
import {Badge} from "@comp/badge";
import {Spinner} from "@comp/spinner";
import {Table, TableHead, TableRow, TD, TH} from "@comp/table";

import {SCompProps} from "@type/common";
import {Placeholder} from "@comp/placeholder";
import {merge} from "@lib/merge";

type TProps = {
	mockCount?: number
} & SCompProps.TBase

export function ClickListSkeleton ({mockCount = 10, className}: TProps): ReactNode {
	let i: number = 0;
	const mock: Array<ReactNode> = [];
	
	while (i < mockCount) {
		mock.push(
			<TableRow key={i}>
				<TD><Placeholder /></TD>
				<TD><Placeholder /></TD>
			</TableRow>
		)
		i++
	}
	
	return (
		<Card variants={container} contained={false} structured className={merge(className, 'animate-pulse')}>
			<CardHead className={'justify-between flex-row items-center'}>
				<H2><Placeholder width={'48'} /></H2>
				<Badge badgeType={'theme'} size={'lg'}>
					<Spinner />
				</Badge>
			</CardHead>
			<Table>
				<TableHead>
					<TableRow>
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
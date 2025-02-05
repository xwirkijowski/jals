"use client"

import {ReactNode, useContext, useState} from "react";
import {motion} from "motion/react";

import {container, item, staggerFly} from "@lib/motion/stagger.fly";

import {LinkContext} from "@ctx/link/link.context";

import {Card, CardBody, CardFooter, CardHead} from "@comp/card";
import {H2, H3, H4, P} from "@comp/typography";
import {Badge} from "@comp/badge";
import {staggerFade} from "@lib/motion/stagger.fade";
import {Button, ButtonGroup} from "@comp/button";
import {DateToLocaleString} from "@comp/date-to-locale-string";
import {Table, TableHead, TableRow, TD, TH} from "@comp/table";

import {SCompProps} from "@type/common";

type TProps = SCompProps.TBase

export function FlagList ({className}: TProps): ReactNode {
	const {link} = useContext(LinkContext);
	
	const [pageInfo, setPageInfo] = useState(null);
	
	const handlePrevPage = () => {};
	const handleNextPage = () => {};
	
	// @todo: Types, interface
	// @todo: Adapt for flag split
	
	if (!link) return null; // Type guard
	
	return (
		<Card variants={container} contained={false} structured className={className}>
			<CardHead className={'justify-between flex-row items-center'}>
				<H2 variants={item}>Flags</H2>
				<Badge badgeType={!!link.flagCount ? 'danger' : 'dark'} size={'lg'}>
					{!!link.flagCount ? (
						link.flagCount === 1
							? `${link.flagCount} flag`
							: `${link.flagCount} flags`
					) : ('No flags')}
				</Badge>
			</CardHead>
			{!link?.flags || link?.flags.length === 0 &&
				<CardBody variants={staggerFly.container} className={'items-center'}>
					<H3 align={"center"} variants={staggerFly.item}>Looks like there are no flags yet :)</H3>
				</CardBody>
			}
			{link?.flags && link?.flags.length > 0 &&
				<Table contained variants={staggerFly.container}>
					<TableHead variants={staggerFly.container}>
						<TableRow variants={staggerFly.container}>
							<TH>Timestamp</TH>
							<TH>Note</TH>
						</TableRow>
					</TableHead>
					<motion.tbody variants={staggerFly.container}>
						{link.flags.map(node => (
							<TableRow key={node.createdAt}>
								<TD>
									<p className={'text-nowrap'}><DateToLocaleString value={node.createdAt}/></p>
								</TD>
								<TD>
									<p className={'truncate'}>{node.note}</p>
								</TD>
							</TableRow>
						))}
					</motion.tbody>
				</Table>
			}
			{link?.flags && link?.flags.length > 0 &&
				<CardFooter variants={staggerFade.container}>
					<P variants={staggerFade.item}>{/* amount shown */} of {link.flagCount} clicks, {pageInfo?.perPage} per page.</P>
					<ButtonGroup variants={staggerFade.container}>
						{pageInfo?.hasPreviousPage === true
							&& <Button variants={staggerFade.item} btnType={'theme'} onClick={handlePrevPage}>Previous</Button>
						}
						<P variants={staggerFade.item}>{pageInfo?.page} of {pageInfo?.pageCount}</P>
						{pageInfo?.hasNextPage
							&& <Button variants={staggerFade.item} btnType={'theme'} onClick={handleNextPage}>Next</Button>
						}
					</ButtonGroup>
				</CardFooter>
			}
		</Card>
	)
}
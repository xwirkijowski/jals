"use client"

import {ReactNode, useCallback, useContext, useMemo, useState, useTransition} from "react";
import {motion} from "motion/react";
import {useSuspenseQuery} from "@apollo/client";

import {getHeaders} from "@lib/auth/session-client";
import {container, item, staggerFly} from "@lib/motion/stagger.fly";

import {LinkContext} from "@ctx/link/link.context";
import {AuthContext} from "@ctx/auth/auth.context";

import {CLICKS} from "@comp/@dashboard/click-list/click-list.queries";

import {Card, CardBody, CardFooter, CardHead} from "@comp/card";
import {H2, H3, H4, P} from "@comp/typography";
import {Badge} from "@comp/badge";
import {staggerFade} from "@lib/motion/stagger.fade";
import {Button, ButtonGroup} from "@comp/button";
import {Spinner} from "@comp/spinner";
import {DateToLocaleString} from "@comp/date-to-locale-string";
import {Table, TableHead, TableRow, TD, TH} from "@comp/table";

import {SCompProps} from "@type/common";

type TProps = SCompProps.TBase

export function ClickList ({className}: TProps): ReactNode {
	const {link} = useContext(LinkContext);
	const {session} = useContext(AuthContext);
	const [isPending, startTransition] = useTransition();
	const [page, setPage] = useState(1);
	
	// @todo: Better handling
	// @todo: Types, interface
	
	const variables = useMemo(()=> ({
		page: page,
		perPage: 10,
		linkId: link!.id
	}), [page]);
	
	const {data: {clicks}, error, fetchMore} = useSuspenseQuery<any>(
		CLICKS,
		{
			variables,
			context: getHeaders(session),
			errorPolicy: "all",
			// fetchPolicy: "no-cache", @todo: Avoid stale data
		}
	);
	
	const handleNextPage = useCallback(() => {
		if (clicks?.pageInfo?.hasNextPage) {
			startTransition(() => {
				setPage(page + 1);
				fetchMore({variables});
			})
		}
	}, [clicks?.pageInfo?.hasNextPage, fetchMore, variables, page]);
	
	const handlePrevPage = useCallback(() => {
		if (clicks?.pageInfo?.hasPreviousPage) {
			startTransition(() => {
				setPage(page - 1);
				fetchMore({variables});
			})
		}
	}, [clicks?.pageInfo?.hasPreviousPage, fetchMore, variables, page]);
	
	return (
		<Card variants={container} contained={false} structured className={className}>
			<CardHead className={'justify-between flex-row items-center'}>
				<H2 variants={item}>Clicks</H2>
				<Badge badgeType={'theme'} size={'lg'}>
					{isPending
						? <Spinner />
						: <>{clicks.pageInfo.total > 0 ? clicks.pageInfo.total === 1 ? `${clicks.pageInfo.total} click` : `${clicks.pageInfo.total} clicks` : 'No clicks'}</>
					}
				</Badge>
			</CardHead>
			{isPending &&
				<CardBody variants={staggerFly.container} className={'items-center'}>
					<Spinner />
				</CardBody>
			}
			{!clicks?.nodes &&
				<CardBody variants={staggerFly.container} className={'items-center'}>
					<H3 align={"center"} variants={staggerFly.item}>Looks like you don't have any clicks yet :(</H3>
				</CardBody>
			}
			{clicks?.nodes && clicks?.nodes.length > 0 &&
				<Table contained variants={staggerFly.container}>
					<TableHead variants={staggerFly.container}>
						<TableRow variants={staggerFly.container}>
							<TH>Timestamp</TH>
							<TH>Agent</TH>
						</TableRow>
					</TableHead>
					<motion.tbody variants={staggerFly.container}>
						{clicks.nodes.map(node => (
							<TableRow key={node.id}>
								<TD>
									<p className={'text-nowrap'}><DateToLocaleString value={node.createdAt}/></p>
								</TD>
								<TD>
									<p className={'truncate'}>{node.userAgent}</p>
								</TD>
							</TableRow>
						))}
					</motion.tbody>
				</Table>
			}
			{clicks?.nodes &&
				<CardFooter variants={staggerFade.container} className={'mt-auto'}>
					<P variants={staggerFade.item}>{clicks?.nodes.length} of {clicks?.pageInfo?.total} clicks, {clicks?.pageInfo?.perPage} per page.</P>
					<ButtonGroup variants={staggerFade.container}>
						{clicks?.pageInfo?.hasPreviousPage === true
							&& <Button variants={staggerFade.item} btnType={'theme'} onClick={handlePrevPage}>Previous</Button>
						}
						<P variants={staggerFade.item}>{page} of {clicks?.pageInfo?.pageCount}</P>
						{clicks?.pageInfo?.hasNextPage === true
							&& <Button variants={staggerFade.item} btnType={'theme'} onClick={handleNextPage}>Next</Button>
						}
					</ButtonGroup>
				</CardFooter>
			}
		</Card>
	)
}
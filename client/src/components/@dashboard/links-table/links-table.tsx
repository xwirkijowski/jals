"use client";

import {ReactNode, useCallback, useContext, useMemo, useState, useTransition} from "react";
import {motion} from "motion/react";
import {useSuspenseQuery} from "@apollo/client";
import Link from "next/link";

import {getHeaders} from "@lib/auth/session-client";
import {staggerFly} from "@lib/motion/stagger.fly";
import {staggerFade} from "@lib/motion/stagger.fade";

import {AuthContext} from "@ctx/auth/auth.context";

import {LINKS} from "@comp/@dashboard/links-table/links-table.queries";
import {LinksTableItem} from "@comp/@dashboard/links-table/links-table-item";

import {Card, CardBody, CardFooter, CardHead} from "@comp/card";
import {Button, ButtonGroup} from "@comp/button";
import {H2, P} from "@comp/typography";
import {Table, TableRow, TableHead, TH} from "@comp/table";
import {Spinner} from "@comp/spinner";

export function LinksTable (): ReactNode {
	const {session, user} = useContext(AuthContext);
	const [isPending, startTransition] = useTransition();
	const [page, setPage] = useState(1);
	
	// @todo: Better handling
	// @todo: Types, interface
	
	const variables = useMemo(()=> ({
		page: page,
		perPage: 10,
		createdBy: user!.id
	}), [page, user]);
	
	const {data: {links}, error, fetchMore} = useSuspenseQuery<any>(
		LINKS,
		{
			variables,
			context: getHeaders(session),
			errorPolicy: "all",
		}
	);
	
	const handleNextPage = useCallback(() => {
		if (links?.pageInfo?.hasNextPage) {
			startTransition(() => {
				setPage(page + 1);
				fetchMore({variables});
			})
		}
	}, [links?.pageInfo?.hasNextPage, fetchMore, variables, page]);

	const handlePrevPage = useCallback(() => {
		if (links?.pageInfo?.hasPreviousPage) {
			startTransition(() => {
				setPage(page - 1);
				fetchMore({variables});
			})
		}
	}, [links?.pageInfo?.hasPreviousPage, fetchMore, variables, page]);
	
	return (
		<Card structured className={"overflow-hidden !max-w-none col-span-full"} variants={staggerFly.container}>
			<CardHead variants={staggerFly.container}>
				<H2 variants={staggerFly.item}>Your links</H2>
			</CardHead>
			{isPending &&
				<CardBody variants={staggerFly.container} className={'items-center'}>
					<Spinner />
				</CardBody>
			}
			{!links?.nodes &&
				<CardBody variants={staggerFly.container} className={'items-center'}>
					<H2 align={"center"} variants={staggerFly.item}>Looks like you don&apos;t have any links yet!</H2>
					<Link passHref href={'/'}>
						<Button variants={staggerFly.item} btnType={'primary'} effects>
							Create link
						</Button>
					</Link>
				</CardBody>
			}
			{links?.nodes && links?.nodes.length > 0 &&
				<Table variants={staggerFly.container}>
					<TableHead variants={staggerFly.container}>
						<TableRow variants={staggerFly.container}>
							<TH className={'max-w-48'}>Link ID</TH>
							<TH className={'max-w-48'}>Target URL</TH>
							<TH className={'text-center w-0'}>Status</TH>
							<TH className={'text-center w-0'}>Clicks</TH>
							<TH className={'text-center w-0'}>Flags</TH>
							<TH className={'text-right'}>Last update</TH>
							<TH className={'text-right'}>Created At</TH>
							<TH className={'text-right w-0'}>Actions</TH>
						</TableRow>
					</TableHead>
					<motion.tbody variants={staggerFly.container}>
						{links.nodes.map(node=> (
							<LinksTableItem key={node.id} node={node} />
						))}
					</motion.tbody>
				</Table>
			}
			{links?.nodes &&
				<CardFooter variants={staggerFade.container} className={'mt-auto'}>
					<P variants={staggerFade.item}>Showing {links?.nodes.length} of {links?.pageInfo?.total} links, {links?.pageInfo?.perPage} per page.</P>
					<ButtonGroup variants={staggerFade.container}>
						{links?.pageInfo?.hasPreviousPage === true
							&& <Button variants={staggerFade.item} btnType={'theme'} onClick={handlePrevPage}>Previous page</Button>
						}
						<P variants={staggerFade.item}>Page {page} of {links?.pageInfo?.pageCount}</P>
						{links?.pageInfo?.hasNextPage === true
							&& <Button variants={staggerFade.item} btnType={'theme'} onClick={handleNextPage}>Next page</Button>
						}
					</ButtonGroup>
				</CardFooter>
			}
		</Card>
	)
}
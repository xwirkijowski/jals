"use client";

import {gql, useSuspenseQuery} from "@apollo/client";
import {AuthContext} from "@ctx/auth/auth.context";
import {useContext, useEffect, useState, useTransition} from "react";
import {getHeaders} from "@lib/auth/session-client";

import {Card, CardBody, CardFooter, CardHead} from "@comp/card";
import {Button, ButtonGroup} from "@comp/button";
import {H2, H3, P} from "@comp/typography";
import {Table, TD, TableRow, TableHead, TH} from "@comp/table";
import {LinksTableItem} from "@comp/@dashboard/links-table-item";

import {staggerFly} from "@lib/motion/stagger.fly";
import {staggerFade} from "@lib/motion/stagger.fade";
import {Spinner} from "@comp/spinner";
import {Anchor} from "@comp/anchor";
import Link from "next/link";

const query = gql`
    query Links($createdBy: ID, $perPage: Int, $page: Int) {
        links(createdBy: $createdBy, perPage: $perPage, page: $page) {
            nodes {
                id
                target
                active
				caution
                clickCount
                flagCount
                updatedAt
                createdAt
            }
	        pageInfo {
                total
                perPage
                pageCount
                currentPage
                hasNextPage
                hasPreviousPage
            }
        }
    }
`;

export default function LinksTable () {
	const {session, user} = useContext(AuthContext);
	if (!user) return (<>Unauthenticated user</>) // @todo: Replace
	
	const [isPending, startTransition] = useTransition();
	const [page, setPage] = useState(1);
	
	const variables = {
		page: page,
		perPage: 5,
		createdBy: user.id
	}
	
	// @todo: Better handling
	const {data: {links}, error, fetchMore} = useSuspenseQuery(
		query,
		{
			variables,
			context: getHeaders(session),
			errorPolicy: 'all',
		}
	);
	
	const handleNextPage = () => {
		if (links?.pageInfo?.hasNextPage) {
			startTransition(() => {
				setPage(page + 1);
				fetchMore({variables});
			})
		}
	};
	
	const handlePrevPage = () => {
		if (links?.pageInfo?.hasPreviousPage) {
			startTransition(() => {
				setPage(page - 1);
				fetchMore({variables});
			})
		}
	};
	
	return (
		<Card structured className={"overflow-hidden !max-w-none col-span-full"} variants={staggerFly.container}>
			<CardHead>
				<H2 variants={staggerFly.item}>Your links</H2>
			</CardHead>
			{isPending &&
				<CardBody className={'items-center'}>
					<Spinner />
				</CardBody>
			}
			{!links?.nodes &&
				<CardBody className={'items-center'}>
					<H2 align={"center"} variants={staggerFly.item}>Looks like you don't have any links yet!</H2>
					<Link passHref href={'/'}>
						<Button btnType={'primary'} effects>
							Create link
						</Button>
					</Link>
				</CardBody>
			}
			{!isPending && links?.nodes && links?.nodes.length > 0 &&
				<Table variants={staggerFly.container}>
					<TableHead variants={staggerFly.container}>
						<TableRow variants={staggerFly.container}>
							<TH variants={staggerFade.item}>Link ID</TH>
							<TH variants={staggerFade.item}>Target URL</TH>
							<TH variants={staggerFade.item} align={'center'}>Status</TH>
							<TH variants={staggerFade.item} align={'center'}>Clicks</TH>
							<TH variants={staggerFade.item} align={'center'}>Flags</TH>
							<TH variants={staggerFade.item} align={'right'}>Last update</TH>
							<TH variants={staggerFade.item} align={'right'}>Created At</TH>
							<TH variants={staggerFade.item} align={'right'}>Actions</TH>
						</TableRow>
					</TableHead>
					<tbody>
						{links.nodes.map(node=> (
							<LinksTableItem key={node.id} node={node} />
						))}
					</tbody>
				</Table>
			}
			{!isPending && links?.nodes &&
				<CardFooter variants={staggerFly.container}>
					<P variants={staggerFly.item}>Showing {links?.nodes.length} of {links?.pageInfo?.total} links, {links?.pageInfo?.perPage} per page.</P>
					<ButtonGroup variants={staggerFly.container}>
						<P variants={staggerFly.item}>Page {page} of {links?.pageInfo?.pageCount}</P>
						{links?.pageInfo?.hasPreviousPage && <Button variants={staggerFly.item} btnType={'theme'} onClick={handlePrevPage}>Previous page</Button>}
						{links?.pageInfo?.hasNextPage && <Button variants={staggerFly.item} btnType={'theme'} onClick={handleNextPage}>Next page</Button>}
					</ButtonGroup>
				</CardFooter>
			}
		</Card>
	)
}
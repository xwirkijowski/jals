"use server";

import cx from "classnames";
import React from "react";
import { redirect } from "next/navigation";
import Link from "next/link";

// Metadata
import {Metadata} from "next";
export const generateMetadata = async (
	{ params }
): Promise<Metadata> => {
	const linkId = (await params).linkId;
	return {
		title: `Redirecting ${linkId}...`,
	}
}

import { gql } from "@apollo/client";
const LINK = gql`
    query Link($linkId: ID!) {
        link(linkId: $linkId) {
            id
            target
            active
            flagCount
	        caution
        }
    }
`;
const CLICK_ADD = gql`
    mutation ($input: CreateClickInput) {
        createClick(input: $input) {
            result {
                success
                errors {
                    path
                    msg
                    code
                }
            }
        }
    }
`;

import { getClient } from "../../lib/apollo-client";
import { getSessionHeader } from "../../lib/auth/session";

import {Spinner} from "@comp/Spinner/Spinner";
import {Tooltip} from "@comp/Tooltip/Tooltip";
import Button from "@comp/Button/Button";
import {LinkNotFound} from "@comp/Logic/NotFound";
import {Badge} from "@comp/Badge/Badge";
import {H2} from "@comp/Typography/H2";
import {P} from "@comp/Typography/P";
import {Card} from "@comp/Card/Card";
import {CardHead} from "@comp/Card/CardHead";
import {CardBody} from "@comp/Card/CardBody";
import {CardFooter} from "@comp/Card/CardFooter";


export default async function (
	{params}
)  {
	const linkId: string = (await params).linkId;
	const requestContext = await getSessionHeader();

	const {data: {link}, loading} = await getClient().query({query: LINK, variables: {linkId: linkId}, context: requestContext});

	const registerClick = async () => {
		"use server";
		const {data: {createClick: {click}}} = await getClient().mutate({mutation: CLICK_ADD, variables: {input: {linkId: linkId}}, context: requestContext, errorPolicy: 'all'});
		return click;
	}

	if (!loading && link && link.target) {
		if (!link.caution && link.active) {
			await registerClick();
			redirect(link.target);
		} else if (!link.active) {
			redirect('/');
		} else if (link.caution) {
			await registerClick();
		}
	}

	return (
		<div className="flex flex-col justify-center items-center flex-1">
			{link ? (
				<>
					{loading ? (<Spinner />) : (
						<Card structured>
							<CardHead className={'items-center'}>
								{/* @ts-ignore workaround for `anchorName` CSS property */}
								<Badge badgeType={link.caution ? 'danger' : 'success'} tooltip ping style={{anchorName: "--active-popover"}} popoverTarget={'active-popover'} popoverTargetAction={'toggle'}>
									{link.id}
								</Badge>
								{/* @ts-ignore workaround for `positionAnchor` CSS property */}
								<Tooltip style={{positionAnchor: "--active-popover"}} id={"active-popover"}>
									<p className={cx('font-bold')}>What does that mean?</p>
									<p>Currently, this links
										is {link.active ? "active" : "not active"}{link.active && link.caution && (" and has been flagged.")}.</p>
									<p>When someone uses this short link,
										they <b>{!link.caution ? "will be" : "will not be"}</b> automatically redirected.
									</p>
									<p>For safety purposes automatic redirects only work if the link does not have any
										flags.</p>
								</Tooltip>

								<H2 align={'center'}>
									{loading && ("Resolving link...")}
									{!link.caution && (`You will be redirected soon`)}
									{link.caution && ("Confirm your destination")}
								</H2>
							</CardHead>
							<CardBody>
									{link.caution &&
										<>
											<P className={'font-bold'}>This link has been flagged or is not active.</P>
											<P>Check if this is the destination you expected and click the button below to continue.</P>
										</>
									}

									<div className={"w-full gap-2 flex flex-col text-left"}>
										<p className={"w-full px-4 py-2 bg-zinc-200 text-zinc-600 rounded-xl border border-transparent font-mono text-wrap break-words overflow-hidden"}>{link.target}</p>
									</div>
							</CardBody>
							<CardFooter>
								{link.caution &&
									<>
										<Link href={`/inspect/${link.id}`} passHref>
											<Button btnType={'dark'}>Inspect link</Button>
										</Link>
										<Link href={link.target} passHref>
											<Button effects={true}>Proceed to destination</Button>
										</Link>
									</>
								}
								{!link.caution && <Spinner/>}
							</CardFooter>
						</Card>
					)}
				</>
			) : (
				<LinkNotFound linkId={linkId} context={'redirect'}/>
			)}
		</div>
	)
}

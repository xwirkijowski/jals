"use server";

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

import cx from "classnames";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getClient } from "../../lib/apollo-client";
import { getSessionHeader } from "../../lib/auth/session";
import {Spinner} from "@comp/Spinner/Spinner";
import {Tooltip} from "@comp/Tooltip/Tooltip";
import Button from "@comp/Button/Button";

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

export default async function (
	{params}
)  {
	const linkId: string = (await params).linkId;
	const requestContext = await getSessionHeader(true);

	const {data: {link}, loading} = await getClient().query({query: LINK, variables: {linkId: linkId}, context: requestContext});

	const registerClick = async () => {
		"use server";
		const {data: {createClick: {click}}} = await getClient().mutate({mutation: CLICK_ADD, variables: {input: {linkId: linkId}}, context: requestContext});
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
		<div className="flex flex-col justify-center items-center flex-1 gap-8">
			{loading ? (<Spinner/>) : (
				<div className={cx('flex-col gap-4 flex items-center max-w-md w-full')}>
					<button style={{"anchor-name": "--active-popover"}} popoverTarget={'active-popover'}
					        popoverTargetAction={'toggle'}
					        className={cx(
						        'cursor-help flex flex-row gap-2 items-center rounded-full py-1 px-2 text-sm float-end text-nowrap',
						        {'bg-red-100 text-red-500': link.caution},
						        {'bg-green-100 text-green-500': !link.caution},
					        )}>
                        <span className={cx(
	                        'h-3 w-3 block rounded-full',
	                        'before:content-[""] before:animate-ping before:h-3 before:w-3 before:block before:rounded-full',
	                        {'bg-red-500 before:bg-red-500': link.caution},
	                        {'bg-green-500 before:bg-green-500': !link.caution},
                        )}/>
						{link.id}
					</button>
					{/* @ts-ignore workaround for `anchor-name` CSS property */}
					<Tooltip style={{"position-anchor": "--active-popover"}} id={"active-popover"}>
						<p className={cx('font-bold')}>What does that mean?</p>
						<p>Currently, this links is {link.active ? "active" : "not active"}{link.active && link.caution && (" and has been flagged.")}.</p>
						<p>When someone uses this short link,
							they <b>{!link.caution ? "will be" : "will not be"}</b> automatically redirected.</p>
						<p>For safety purposes automatic redirects only work if the link does not have any
							flags.</p>
					</Tooltip>

					<h2 className="font-bold text-zinc-900 text-2xl/tight sm:text-2xl/tight text-center">
						{loading && ("Resolving link...")}
						{!link.caution && (`You will be redirected soon`)}
						{link.caution && ("Confirm your destination")}
					</h2>
					{link.caution && <p className={cx('text-zinc-600 text-md')}>Link has been flagged or is not active, check if this is the destination you expected and click the button below to continue</p>}

					<div className={"w-full gap-2 flex flex-col text-left"}>
						<p className={"w-full px-4 py-2 bg-zinc-200 text-zinc-600 rounded-xl border border-transparent font-mono text-wrap break-words overflow-hidden"}>{link.target}</p>
					</div>

					{link.caution &&
						<div className={'flex gap-4'}>
							<Link href={`/inspect/${link.id}`} passHref><Button btnType={'dark'}>Inspect link</Button></Link>
							<Link href={link.target} passHref><Button effects={true}>Proceed to destination</Button></Link>
						</div>
					}

					{loading || !link.caution && <Spinner/>}
				</div>
			)}
		</div>
	)
}
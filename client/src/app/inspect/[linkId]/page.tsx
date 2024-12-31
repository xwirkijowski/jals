
// Metadata
import {Metadata, ResolvingMetadata} from "next";
export const generateMetadata = async (
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> => {
   const linkId = (await params).linkId;
   return {
       title: `Inspect ${linkId}`,
   }
}

type Props = {
    params: Promise<{linkId: string}>
    searchParams: Promise<{[key: string]: string | undefined}>
}

// Query
import { gql } from "@apollo/client";
const LINK = gql`
    query Link($linkId: ID!) {
        link(linkId: $linkId) {
            target
            active
            clickCount
            flagCount
            flags {
                note
                createdAt
            }
            createdAt
            updatedAt
            version
        }
    }
`;

import {getClient} from '../../../apollo-client';
import {Tooltip} from "@comp/Tooltip/Tooltip";

import cx from 'classnames';

const LinkPage = async (
    {params}
) => {
    const linkId = (await params).linkId;
    const {data: {link}} = await getClient().query({query: LINK, variables: {linkId: linkId}});

    return (
        <div className="flex flex-col justify-center items-center text-left flex-1 gap-8">
            {link.flagCount > 0 ? (
                    <div
                        className="max-w-xl  text-white bg-orange-500 p-4 items-center shadow-xl shadow-orange-500/20 rounded-xl w-full flex gap-4">
                        <h3 className={"font-bold uppercase text-sm"}>Warning</h3> |
                        <p>This link has been flagged {link.flagCount} {link.flagCount === 1 ? 'time' : 'times'}!</p>
                    </div>
                ) :
                null
            }
            <div className="w-full max-w-xl flex flex-col bg-white shadow-xl rounded-xl">
                <div className={"p-8"}>
                    <h2 className="font-bold text-zinc-900 text-2xl/tight sm:text-2xl/tight float-start">
                        Inspecting link<br/><span className={"text-orange-500"}>{linkId}</span>
                    </h2>
                    {/* @ts-ignore workaround for `anchor-name` CSS property */}
                    <button style={{"anchor-name": "--active-popover"}} popoverTarget={'active-popover'} popoverTargetAction={'toggle'}
                         className={cx(
                        'cursor-help flex flex-row gap-2 items-center rounded-full py-1 px-2 text-sm float-end text-nowrap',
                        {'bg-red-100 text-red-500': !link.active},
                        {'bg-green-100 text-green-500': link.active},
                    )}>
                        <span className={cx(
                            'h-3 w-3 block rounded-full',
                            'before:content-[""] before:animate-ping before:h-3 before:w-3 before:block before:rounded-full',
                            {'bg-red-500 before:bg-red-500': !link.active},
                            {'bg-green-500 before:bg-green-500': link.active},
                        )} />
                        {link.active ? "Active" : "Not active"}
                    </button>
                    {/* @ts-ignore workaround for `anchor-name` CSS property */}
                    <Tooltip style={{"position-anchor": "--active-popover"}} id={"active-popover"}>
                        <p className={cx('font-bold')}>What does that mean?</p>
                        <p>{link.active
                            ? (<>When someone uses this short link, they <b>will</b> be automatically
                                redirected.</>)
                            : (<>When someone uses this short link, they <b>will not</b> be automatically
                                redirected.</>)}</p>
                        <p>For safety purposes automatic redirects only work if the link does not have any
                            flags.</p>
                    </Tooltip>
                </div>
                <div className={"p-8 border-y grid grid-cols-2 w-full gap-4"}>
                    <div className={"w-full gap-2 flex flex-col col-span-full"}>
                        <h3 className={"font-bold"}>Target URL</h3>
                        <p className={"w-full px-4 py-2 bg-zinc-200 text-zinc-600 rounded-xl border border-transparent font-mono text-wrap break-words overflow-hidden"}>{link.target}</p>
                    </div>
                    <div className={"gap-2 flex flex-col"}>
                        <h3 className={"font-bold"}>Creation time</h3>
                        <p className={"text-zinc-600"}>{new Date(link.createdAt).toLocaleString()}</p>
                    </div>
                    <div className={"gap-2 flex flex-col"}>
                        <h3 className={"font-bold"}>Click count</h3>
                        <p className={"text-zinc-600"}>{link.ClickCount > 0 ? link.clickCount : "No clicks yet"}</p>
                    </div>
                    <div className={"gap-2 flex flex-col"}>
                        <h3 className={"font-bold"}>Last modified</h3>
                        <p className={"text-zinc-600"}>{link.version > 0 ? new Date(link.createdAt).toLocaleString() : "Not modified yet"}</p>
                    </div>
                    <div className={"gap-2 flex flex-col"}>
                    <h3 className={"font-bold"}>Version</h3>
                        <p className={"text-zinc-600"}>{link.version}</p>
                    </div>
                </div>
                <div className={"col-span-full flex gap-8 p-8 justify-between items-center"}>
                    <p className={"text-zinc-900"}>Is this link malicious or inappropriate?</p>
                    <button className={"duration-150 transition-all px-4 py-3 text-base bg-red-500 text-white block text-nowrap rounded-xl font-bold shadow-xl shadow-red-500/20 hover:scale-95 hover:bg-red-400 hover:shadow-md"}>Flag for moderation</button>
                </div>
            </div>
        </div>
    )
}

export default LinkPage;
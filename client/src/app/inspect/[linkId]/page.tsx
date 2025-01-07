"use client"

import cx from 'classnames';

// Components
import {Tooltip} from "@comp/Tooltip/Tooltip";
import Callout from "@comp/Callout/Callout";
import Button from "@comp/Button/Button";

// Context
import {useContext} from "react";
import {LinkContext} from "../../../contexts/LinkContext";
import Link from "next/link";

const LinkPage = async () => {
    let {data} = useContext(LinkContext);

    return (
        <div className="flex flex-col justify-center items-center text-left flex-1 gap-8">
            {data.link.flagCount > 0 ? (
                    <Callout title={"Warning"} type={"warning"}>
                        <p>This link has been
                            flagged {data.link.flagCount} {data.link.flagCount === 1 ? 'time' : 'times'}!</p>
                    </Callout>
                ) :
                null
            }
            <div className="w-full max-w-xl flex flex-col bg-white shadow-xl rounded-xl">
                <div className={"p-8"}>
                    <h2 className="font-bold text-zinc-900 text-2xl/tight sm:text-2xl/tight float-start">
                        Inspecting link<br/><span className={"text-orange-500"}>{data.link.id}</span>
                    </h2>
                    {/* @ts-ignore workaround for `anchor-name` CSS property */}
                    <button style={{"anchor-name": "--active-popover"}} popoverTarget={'active-popover'} popoverTargetAction={'toggle'}
                         className={cx(
                        'cursor-help flex flex-row gap-2 items-center rounded-full py-1 px-2 text-sm float-end text-nowrap',
                        {'bg-red-100 text-red-500': !data.link.active},
                        {'bg-green-100 text-green-500': data.link.active},
                    )}>
                        <span className={cx(
                            'h-3 w-3 block rounded-full',
                            'before:content-[""] before:animate-ping before:h-3 before:w-3 before:block before:rounded-full',
                            {'bg-red-500 before:bg-red-500': !data.link.active},
                            {'bg-green-500 before:bg-green-500': data.link.active},
                        )} />
                        {data.link.active ? "Active" : "Not active"}
                    </button>
                    {/* @ts-ignore workaround for `anchor-name` CSS property */}
                    <Tooltip style={{"position-anchor": "--active-popover"}} id={"active-popover"}>
                        <p className={cx('font-bold')}>What does that mean?</p>
                        <p>Currently, this links is {data.link.active ? "active" : "not active"}.</p>
                        <p>When someone uses this short link, they <b>{data.link.active ? "will be" : "will not be"}</b> automatically redirected.</p>
                        <p>For safety purposes automatic redirects only work if the link does not have any
                            flags.</p>
                    </Tooltip>
                </div>
                <div className={"p-8 border-y grid grid-cols-2 w-full gap-4"}>
                    <div className={"w-full gap-2 flex flex-col col-span-full"}>
                        <h3 className={"font-bold"}>Target URL</h3>
                        <p className={"w-full px-4 py-2 bg-zinc-200 text-zinc-600 rounded-xl border border-transparent font-mono text-wrap break-words overflow-hidden"}>{data.link.target}</p>
                    </div>
                    <div className={"gap-2 flex flex-col"}>
                        <h3 className={"font-bold"}>Creation time</h3>
                        <p className={"text-zinc-600"}>{new Date(data.link.createdAt).toLocaleString()}</p>
                    </div>
                    <div className={"gap-2 flex flex-col"}>
                        <h3 className={"font-bold"}>Click count</h3>
                        <p className={"text-zinc-600"}>{data.link.ClickCount > 0 ? data.link.clickCount : "No clicks yet"}</p>
                    </div>
                    <div className={"gap-2 flex flex-col"}>
                        <h3 className={"font-bold"}>Last modified</h3>
                        <p className={"text-zinc-600"}>{data.link.version > 0 && data.link.updatedAt ? new Date(data.link.updatedAt).toLocaleString() : "Not modified yet"}</p>
                    </div>
                    <div className={"gap-2 flex flex-col"}>
                    <h3 className={"font-bold"}>Version</h3>
                        <p className={"text-zinc-600"}>{data.link.version}</p>
                    </div>
                </div>
                <div className={"col-span-full flex gap-8 p-8 justify-between items-center"}>
                    <p className={"text-zinc-900"}>Is this link malicious or inappropriate?</p>
                    <Link href={`/inspect/${data.link.id}/flag`} passHref><Button type={"danger"} effects={true}>Flag for moderation</Button></Link>
                </div>
            </div>
        </div>
    )
}

export default LinkPage;
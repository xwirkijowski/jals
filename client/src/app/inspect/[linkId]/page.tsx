"use client"

import cx from 'classnames';
import Link from "next/link";

// Components
import {Tooltip} from "@comp/Tooltip/Tooltip";
import Callout from "@comp/Callout/Callout";
import Button from "@comp/Button/Button";
import {Card} from "@comp/Card/Card";
import {CardHead} from "@comp/Card/CardHead";
import {CardBody} from "@comp/Card/CardBody";
import {CardFooter} from "@comp/Card/CardFooter";
import {H2} from "@comp/Typography/H2";
import {H3} from "@comp/Typography/H3";
import {P} from "@comp/Typography/P";

// Context
import {useContext} from "react";
import {LinkContext} from "../../../contexts/link/link.context";

export default () => {
    let {data} = useContext(LinkContext);

    return (
        <div className="flex flex-col justify-center items-center text-left flex-1 gap-8">
            {data.link.flagCount > 0 && data.link.flagCount < 5 && (
                    <Callout title={"Warning"} type={"warning"}>
                        <p>This link has been
                            flagged <span className={'font-bold'}>{data.link.flagCount} {data.link.flagCount === 1 ? 'time' : 'times'}</span>!</p>
                    </Callout>
                )
            }
            {data.link.flagCount >= 5 && (
                <Callout title={"Caution"} type={"danger"}>
                    <p>This link has been
                        flagged <span className={'font-bold'}>{data.link.flagCount} times</span>!</p>
                </Callout>
            )
            }
            <Card structured>
                <CardHead>
                    <H2 className="float-start">
                        Inspecting link<br/><span className={"text-orange-500"}>{data.link.id}</span>
                    </H2>
                    {/* @ts-ignore workaround for `anchorName` CSS property */}
                    <button style={{anchorName: "--active-popover"}} popoverTarget={'active-popover'} popoverTargetAction={'toggle'}
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
                    {/* @ts-ignore workaround for `positionAnchor` CSS property */}
                    <Tooltip style={{positionAnchor: "--active-popover"}} id={"active-popover"}>
                        <p className={cx('font-bold')}>What does that mean?</p>
                        <p>Currently, this links is {data.link.active ? "active" : "not active"}.</p>
                        <p>When someone uses this short link, they <b>{data.link.active ? "will be" : "will not be"}</b> automatically redirected.</p>
                        <p>For safety purposes automatic redirects only work if the link does not have any
                            flags.</p>
                    </Tooltip>
                </CardHead>
                <CardBody grid>
                    <div className={"w-full gap-2 flex flex-col col-span-full"}>
                        <H3 className={"!text-base"}>Target URL</H3>
                        <p className={"w-full px-4 py-2 bg-zinc-200 text-zinc-600 rounded-xl border border-transparent font-mono text-wrap break-words overflow-hidden"}>{data.link.target}</p>
                    </div>
                    <div className={"gap-2 flex flex-col"}>
                        <H3 className={"!text-base"}>Creation time</H3>
                        <P>{new Date(data.link.createdAt).toLocaleString()}</P>
                    </div>
                    <div className={"gap-2 flex flex-col"}>
                        <H3 className={"!text-base"}>Click count</H3>
                        <P>{data.link.ClickCount > 0 ? data.link.clickCount : "No clicks yet"}</P>
                    </div>
                    <div className={"gap-2 flex flex-col"}>
                        <H3 className={"!text-base"}>Last modified</H3>
                        <P>{data.link.version > 0 && data.link.updatedAt ? new Date(data.link.updatedAt).toLocaleString() : "Not modified yet"}</P>
                    </div>
                    <div className={"gap-2 flex flex-col"}>
                        <H3 className={"!text-base"}>Version</H3>
                        <P>{data.link.version}</P>
                    </div>
                </CardBody>
                <CardFooter>
                    <H3>Is this link malicious or inappropriate?</H3>
                    <Link href={`/inspect/${data.link.id}/flag`} passHref><Button btnType={"danger"} effects={true}>Flag for moderation</Button></Link>
                </CardFooter>
            </Card>
        </div>
    )
}
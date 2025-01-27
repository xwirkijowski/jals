"use client"

import cx from 'classnames';
import React, {useContext} from "react";
import Link from "next/link";
import {motion} from "motion/react";

// Components
import {Tooltip} from "@comp/Tooltip/Tooltip";
import {Callout} from "@comp/Callout/Callout";
import {Button} from "@comp/Button/Button";
import {Card} from "@comp/Card/Card";
import {CardHead} from "@comp/Card/CardHead";
import {CardBody} from "@comp/Card/CardBody";
import {CardFooter} from "@comp/Card/CardFooter";
import {H2} from "@comp/Typography/H2";
import {H3} from "@comp/Typography/H3";
import {P} from "@comp/Typography/P";
import {Badge} from "@comp/Badge/Badge";
import {DateToLocaleString} from "@comp/DateLocaleString/DateToLocaleString";
import {Container} from "@comp/Container/Container";

// Context
import {LinkContext} from "@ctx/link/link.context";

import {container, item} from "@lib/motion/stagger";

const Page = (): React.ReactNode => {
    const {data} = useContext(LinkContext);

    // @todo Handle broken context edge case
    if (!data?.link) {return null}

    return (
        <Container>
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
            )}
            <Card variants={container} structured>
                <CardHead variants={container} flex={false}>
                    <H2 variants={item} className="float-start">
                        Inspecting link<br/><span className={"text-orange-500"}>{data.link.id}</span>
                    </H2>
                    {/* @ts-ignore workaround for `anchorName` CSS property */}
                    <Badge variants={item} badgeType={data.link.active?'success':'danger'} tooltip ping style={{anchorName: "--active-popover"}} popoverTarget={'active-popover'} popoverTargetAction={'toggle'}>
                        {data.link.active ? "Active" : "Not active"}
                    </Badge>
                    {/* @ts-ignore workaround for `positionAnchor` CSS property */}
                    <Tooltip style={{positionAnchor: "--active-popover"}} id={"active-popover"}>
                        <p className={cx('font-bold')}>What does that mean?</p>
                        <p>Currently, this links is {data.link.active ? "active" : "not active"}.</p>
                        <p>When someone uses this short link, they <b>{data.link.active ? "will be" : "will not be"}</b> automatically redirected.</p>
                        <p>For safety purposes automatic redirects only work if the link does not have any
                            flags.</p>
                    </Tooltip>
                </CardHead>
                <CardBody variants={container} grid>
                    <motion.div variants={item} className={"w-full gap-2 flex flex-col col-span-full"}>
                        <H3 className={"!text-base"}>Target URL</H3>
                        <p className={"w-full px-4 py-2 bg-zinc-200 text-zinc-600 rounded-xl border border-transparent font-mono text-wrap break-words overflow-hidden"}>{data.link.target}</p>
                    </motion.div>
                    <motion.div variants={item} className={"gap-2 flex flex-col"}>
                        <H3 className={"!text-base"}>Creation time</H3>
                        <P><DateToLocaleString value={data.link.createdAt} /></P>
                    </motion.div>
                    <motion.div variants={item} className={"gap-2 flex flex-col"}>
                        <H3 className={"!text-base"}>Click count</H3>
                        <P>{data.link.clickCount > 0 ? data.link.clickCount : "No clicks yet"}</P>
                    </motion.div>
                    <motion.div variants={item} className={"gap-2 flex flex-col"}>
                        <H3 className={"!text-base"}>Last modified</H3>
                        <P>{data.link.version > 0 && data.link.updatedAt ? <DateToLocaleString value={data.link.updatedAt} /> : "Not modified yet"}</P>
                    </motion.div>
                    <motion.div variants={item} className={"gap-2 flex flex-col"}>
                        <H3 className={"!text-base"}>Version</H3>
                        <P>{data.link.version}</P>
                    </motion.div>
                </CardBody>
                <CardFooter variants={container}>
                    <H3 variants={item}>Is this link malicious or inappropriate?</H3>
                    <Link href={`/inspect/${data.link.id}/flag`} passHref><Button variants={item} btnType={"danger"} effects={true}>Flag for moderation</Button></Link>
                </CardFooter>
            </Card>
        </Container>
    )
}

export default Page;
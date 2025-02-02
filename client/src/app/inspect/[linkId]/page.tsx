"use client"

import cx from 'classnames';
import React, {useContext} from "react";
import Link from "next/link";
import {motion} from "motion/react";

// Components
import {Tooltip} from "@comp/tooltip";
import {Callout} from "@comp/callout";
import {Button} from "@comp/button";
import {Card, CardHead, CardBody, CardFooter} from "@comp/card";
import {H2, H3, P} from "@comp/typography";
import {Badge} from "@comp/badge";
import {DateToLocaleString} from "@comp/date-to-locale-string";
import {Container} from "@comp/container";

// Context
import {LinkContext} from "@ctx/link/link.context";

import {container, item} from "@lib/motion/stagger.fly";

const Page = (): React.ReactNode => {
    const {link} = useContext(LinkContext);

    // @todo Handle broken context edge case
    if (!link) {return null}

    return (
        <Container>
            {link.flagCount > 0 && link.flagCount < 5 && (
                    <Callout title={"Warning"} type={"warning"}>
                        <p>This link has been
                            flagged <span className={'font-bold'}>{link.flagCount} {link.flagCount === 1 ? 'time' : 'times'}</span>!</p>
                    </Callout>
                )
            }
            {link.flagCount >= 5 && (
                <Callout title={"Caution"} type={"danger"}>
                    <p>This link has been
                        flagged <span className={'font-bold'}>{link.flagCount} times</span>!</p>
                </Callout>
            )}
            <Card variants={container} structured>
                <CardHead variants={container} flex={false}>
                    <H2 variants={item} className="float-start">
                        Inspecting link<br/><span className={"text-orange-500"}>{link.id}</span>
                    </H2>
                    {/* @ts-ignore workaround for `anchorName` CSS property */}
                    <Badge variants={item} className={"float-end"} badgeType={link.active?'success':'danger'} tooltip ping style={{anchorName: "--active-popover"}} popoverTarget={'active-popover'} popoverTargetAction={'toggle'}>
                        {link.active ? "Active" : "Not active"}
                    </Badge>
                    {/* @ts-ignore workaround for `positionAnchor` CSS property */}
                    <Tooltip style={{positionAnchor: "--active-popover"}} id={"active-popover"}>
                        <p className={cx('font-bold')}>What does that mean?</p>
                        <p>Currently, this links is {link.active ? "active" : "not active"}.</p>
                        <p>When someone uses this short link, they <b>{link.active ? "will be" : "will not be"}</b> automatically redirected.</p>
                        <p>For safety purposes automatic redirects only work if the link does not have any
                            flags.</p>
                    </Tooltip>
                </CardHead>
                <CardBody variants={container} grid>
                    <motion.div variants={item} className={"w-full gap-2 flex flex-col col-span-full"}>
                        <H3 className={"!text-base"}>Target URL</H3>
                        <p className={"w-full px-4 py-2 bg-zinc-200 text-zinc-600 rounded-xl border border-transparent font-mono text-wrap break-words overflow-hidden"}>{link.target}</p>
                    </motion.div>
                    <motion.div variants={item} className={"gap-2 flex flex-col"}>
                        <H3 className={"!text-base"}>Creation time</H3>
                        <P><DateToLocaleString value={link.createdAt} /></P>
                    </motion.div>
                    <motion.div variants={item} className={"gap-2 flex flex-col"}>
                        <H3 className={"!text-base"}>Click count</H3>
                        <P>{link.clickCount > 0 ? link.clickCount : "No clicks yet"}</P>
                    </motion.div>
                    <motion.div variants={item} className={"gap-2 flex flex-col"}>
                        <H3 className={"!text-base"}>Last modified</H3>
                        <P>{link.version > 0 && link.updatedAt ? <DateToLocaleString value={link.updatedAt} /> : "Not modified yet"}</P>
                    </motion.div>
                    <motion.div variants={item} className={"gap-2 flex flex-col"}>
                        <H3 className={"!text-base"}>Version</H3>
                        <P>{link.version}</P>
                    </motion.div>
                </CardBody>
                <CardFooter variants={container}>
                    <H3 variants={item}>Is this link malicious or inappropriate?</H3>
                    <Link href={`/inspect/${link.id}/flag`} passHref><Button variants={item} btnType={"danger"} effects={true}>Flag for moderation</Button></Link>
                </CardFooter>
            </Card>
        </Container>
    )
}

export default Page;
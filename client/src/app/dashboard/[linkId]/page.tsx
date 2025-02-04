"use client";

import cx from 'classnames';
import React, {useContext} from "react";
import Link from "next/link";
import {motion} from "motion/react";

// Components
import {Tooltip} from "@comp/tooltip";
import {Button} from "@comp/button";
import {Card, CardBody} from "@comp/card";
import {H1, H3, P} from "@comp/typography";
import {Badge} from "@comp/badge";
import {DateToLocaleString} from "@comp/date-to-locale-string";

// Context
import {LinkContext} from "@ctx/link/link.context";

import {container, item} from "@lib/motion/stagger.fly";

const Page = (): React.ReactNode => {
    const {link} = useContext(LinkContext);

    // @todo Handle broken context edge case
    if (!link) {return null}

    return (
        <>
            <motion.div className={'flex flex-row gap-4 items-center'} variants={container} >
                <Link passHref href={'/dashboard'}><Button btnType={'theme'} variants={item}>Go back</Button></Link>
                <H1 variants={item}>Inspecting <span className={'text-orange-500'}>{link.id}</span></H1>
                {/* @ts-ignore workaround for `anchorName` CSS property */}
                <Badge variants={item} badgeType={link.active?'success':'danger'} tooltip ping style={{anchorName: "--active-popover"}} popoverTarget={'active-popover'} popoverTargetAction={'toggle'}>
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
            </motion.div>
            <motion.div variants={container} className={cx("grid grid-cols-4 gap-8 flex-1 auto-rows-min")}>
                <Card variants={container} structured className={'overflow-hidden max-w-none col-span-2'}>
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
                </Card>
            </motion.div>
        </>
    )
}

export default Page;
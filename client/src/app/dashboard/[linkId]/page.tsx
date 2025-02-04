"use client";

import cx from 'classnames';
import React, {useContext, useEffect} from "react";
import {motion} from "motion/react";
import Link from "next/link";
import {useRouter} from "next/navigation";

import {container, item} from "@lib/motion/stagger.fly";

// Components
import {Tooltip} from "@comp/tooltip";
import {Button, ButtonGroup} from "@comp/button";
import {Card} from "@comp/card";
import {H2, P} from "@comp/typography";
import {Badge} from "@comp/badge";
import {DateToLocaleString} from "@comp/date-to-locale-string";
import DataCard from "@comp/@dashboard/data-card/data-card";

// Context
import {LinkContext} from "@ctx/link/link.context";
import {AuthContext} from "@ctx/auth/auth.context";
import {NotificationContext} from "@ctx/notification/notification.context";


const Page = (): React.ReactNode => {
    const {link} = useContext(LinkContext);
    const {user} = useContext(AuthContext);
    const {add} = useContext(NotificationContext);
    const router = useRouter();
    
    useEffect(() => {
        if (!link) {
            add({
                type: 'danger',
                title: "Oops!",
                content: (<p>This link does not exists. Maybe you already deleted it?</p>),
                dismissible: false,
            })
            
            router.push('/dashboard')
        }
    }, []);

    if (!link) return null;
    
    return (
        <>
            <motion.div className={'flex flex-row gap-4 items-center'} variants={container} >
                <H2 variants={item}>Inspecting <span className={'text-orange-500'}>{link.id}</span></H2>
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
            <motion.div variants={container} className={cx("grid grid-cols-6 gap-8 flex-1 auto-rows-min")}>
                <DataCard variants={container} label={'Target URL'} className={'col-span-full md:col-span-4'}>
                    <p className={"w-full px-4 py-2 bg-zinc-200 text-zinc-600 rounded-xl border border-transparent font-mono text-wrap break-words overflow-hidden"}>{link.target}</p>
                </DataCard>
                
                <Card contained={false} structured className={'col-start-5 col-span-2 row-span-full'}>
                
                </Card>
                
                <DataCard variants={container} label={'Click count'} className={'col-span-full sm:col-span-3 md:col-span-2 lg:col-span-1'}>
                    <P className={cx(`text-${link.clickCount > 0 ? '4' : ''}xl font-bold`)}>
                        {link.clickCount > 0 ? link.clickCount : "No clicks"}
                    </P>
                </DataCard>
                
                <DataCard variants={container} label={'Flag Count'} className={'col-span-full sm:col-span-3 md:col-span-2 lg:col-span-1'}>
                    <P className={cx(`text-${link.clickCount > 0 ? '4' : ''}xl font-bold`)}>
                        {link.flagCount || 'No flags'}
                    </P>
                </DataCard>
                
                <DataCard variants={container} label={'Created at'} className={'col-span-full sm:col-span-3 md:col-span-2'}>
                    <P className={'text-xl font-bold'}><DateToLocaleString value={link.createdAt}/></P>
                    <P className={'text-base'}>By {user!.email === link.createdBy.email ? 'you' : link.createdBy.email}</P>
                </DataCard>
                
                <DataCard variants={container} label={'Last modified'} className={'col-span-full sm:col-span-3 md:col-span-2'}>
                    <P className={'text-xl font-bold'}>{link.version > 0 && link.updatedAt ?
                        <DateToLocaleString value={link.updatedAt}/> : "Not modified yet"}</P>
                    <P className={'text-base'}>Version {link.version + 1}</P>
                </DataCard>
                
                <Card variants={container} contained={false} className={"col-span-full flex-row justify-between"}>
                    <Link passHref href={'/dashboard'}><Button btnType={'theme'} variants={item}>Go back</Button></Link>
                    <ButtonGroup className={"justify-end"}>
                        <Link passHref href={`/dashboard/${link.id}/modify`}><Button btnType={'theme'} variants={item}>Modify</Button></Link>
                        <Link passHref href={`/dashboard/${link.id}/delete`}><Button btnType={'danger'} variants={item}>Delete</Button></Link>
                    </ButtonGroup>
                </Card>
            </motion.div>
        </>
    )
}

export default Page;
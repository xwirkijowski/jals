'use client';

import React, {ReactNode, useActionState, useContext, useEffect} from "react";
import {motion} from "motion/react";

// Actions
import {DeleteLinkAction} from './modify.action';

import {LinkContext} from "@ctx/link/link.context";
import {NotificationContext} from "@ctx/notification/notification.context";

// Components
import {Spinner} from "@comp/spinner";
import {Button} from "@comp/button";
import {Card, CardHead, CardFooter, CardBody} from "@comp/card";
import {H2, H3, P} from "@comp/typography";
import {Badge} from "@comp/badge";
import {CloseButton} from "@act/shared/CloseButton";
import {Input} from "@comp/form/input";
import {Callout} from "@comp/callout";

// Types
import {TActionPropsMode} from "@act/shared/common.types";
import {TResult} from "@type/data/response";
import {item, staggerFly} from "@lib/motion/stagger.fly";

export const ModifyLinkForm = (
	{mode = 'page'}: TActionPropsMode
): ReactNode => {
	const {add} = useContext(NotificationContext);
	const {link} = useContext(LinkContext);
	const [state, action, pending] = useActionState<TResult|null>(DeleteLinkAction.bind(null, {link}), null);
	
	useEffect(() => {
		if (!pending && state) {
			add({
				type: state?.success ? 'success' : 'danger',
				title: (state?.success ? "Link modified successfully!" : "Couldn't modify link!"),
				...(state?.success
					&& {content: (<p>Your local data will update soon.</p>)}),
				...(state?.success === false
					&& state?.errorCodes.includes('LINK_NOT_FOUND')
					&& {content: (<p>This link does not exists. Maybe you deleted it?</p>)}),
				dismissible: false,
			})
			
			// @todo: Add refetch context
		}
	}, [pending, state]);
	
	return (
		<form action={action} className={"w-full max-w-xl"}>
			<Card variants={staggerFly.container} structured>
				<CardHead variants={staggerFly.container} flex={false}>
					<H2 variants={staggerFly.item} className="float-start">Modify link</H2>
					<Badge variants={staggerFly.item} badgeType={'theme'} className={"float-end"}>
						{link!.id}
					</Badge>
				</CardHead>
				<CardBody variants={staggerFly.container}>
					{state?.success ? (
						<Callout type="success">
							<p>Link modified successfully!</p>
						</Callout>
					) : (
						<>
							<motion.div variants={item} className={"w-full gap-2 flex flex-col col-span-full"}>
								<H3 className={"!text-base"}>Current URL</H3>
								<p className={"w-full px-4 py-2 bg-zinc-200 text-zinc-600 rounded-xl border border-transparent font-mono text-wrap break-words overflow-hidden"}>{link!.target}</p>
							</motion.div>
							<motion.div variants={item} className={"w-full gap-2 flex flex-col col-span-full"}>
								<H3 className={"!text-base"}>New URL</H3>
								<Input required disabled={pending} placeholder={"Input a valid URL..."}
								       name={"target"}/>
							</motion.div>
						</>
					)}
				
				</CardBody>
				{state?.success ? (
					<CardFooter className={"!justify-end"} variants={staggerFly.container}>
						<CloseButton variants={staggerFly.item} mode={mode} href={`/dashboard`} label={'Close'}/>
					</CardFooter>
				) : (
					<CardFooter variants={staggerFly.container}>
						<CloseButton variants={staggerFly.item} mode={mode} href={`/dashboard`} label={'Cancel'}/>
						
						<Button variants={staggerFly.item} btnType={"info"} type={'submit'} disabled={pending}
						        effects={true}>
							{pending ? (<Spinner/>) : ("Modify")}
						</Button>
					</CardFooter>
				)}
			</Card>
		</form>
	)
}
'use client';

import {ReactNode, useActionState, useContext, useEffect} from "react";

// Actions
import {DeleteLinkAction} from './delete.action';

import {LinkContext} from "@ctx/link/link.context";
import {NotificationContext} from "@ctx/notification/notification.context";

// Components
import {Spinner} from "@comp/spinner";
import {Button} from "@comp/button";
import {Card, CardHead, CardFooter, CardBody} from "@comp/card";
import {H2, P} from "@comp/typography";
import {Badge} from "@comp/badge";
import {CloseButton} from "@act/shared/CloseButton";
import {Callout} from "@comp/callout";

// Types
import {TActionPropsMode} from "@act/shared/common.types";
import {TResult} from "@type/data/response";
import {staggerFly} from "@lib/motion/stagger.fly";

export const DeleteLinkForm = (
	{mode = 'page'}: TActionPropsMode
): ReactNode => {
	const {add} = useContext(NotificationContext);
	const {link} = useContext(LinkContext);
	const [state, action, pending] = useActionState<TResult|null>(DeleteLinkAction.bind(null, {link}), null);
	
	useEffect(() => {
		if (!pending && state) {
			add({
				type: state?.success ? 'success' : 'danger',
				title: (state?.success ? "Link deleted successfully!" : "Couldn't delete link!"),
				...(state?.success === false
					&& state?.errorCodes.includes('LINK_NOT_FOUND')
					&& {content: (<p>This link does not exists. Maybe you already deleted it?</p>)}),
				dismissible: false,
			})
			
			// @todo: Add refetch context
		}
	}, [pending, state]);
	
	return (
		<form action={action} className={"w-full max-w-xl"}>
			<Card variants={staggerFly.container} structured>
				<CardHead variants={staggerFly.container} flex={false}>
					<H2 variants={staggerFly.item} className="float-start">Delete link</H2>
					<Badge variants={staggerFly.item} badgeType={'theme'} className={"float-end"}>
						{link!.id}
					</Badge>
				</CardHead>
				<CardBody variants={staggerFly.container}>
					{state?.success ? (
						<Callout type="success">
							<p>Link deleted successfully!</p>
						</Callout>
					) : (
						<>
							<P variants={staggerFly.item}>Are you sure you want to delete this link?</P>
							<P className={'font-bold'} variants={staggerFly.item}>Analytics and click data will be lost.</P>
						</>
					)}
				</CardBody>
				{state?.success ? (
					<CardFooter className={"!justify-end"} variants={staggerFly.container}>
						<CloseButton variants={staggerFly.item} mode={mode} href={`/dashboard`} label={'Close'} />
					</CardFooter>
				) : (
					<CardFooter variants={staggerFly.container}>
						<CloseButton variants={staggerFly.item} mode={mode} href={`/dashboard`} label={'Cancel'} />
						
						<Button variants={staggerFly.item} btnType={"danger"} type={'submit'} disabled={pending} effects={true}>
							{pending ? (<Spinner/>) : ("Confirm")}
						</Button>
					</CardFooter>
				)}
			</Card>
		</form>
	)
}
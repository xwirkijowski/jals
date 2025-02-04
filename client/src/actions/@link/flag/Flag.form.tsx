'use client';

import {ReactNode, useActionState, useContext, useEffect} from "react";
import Link from "next/link";

// Actions
import {FlagAction} from './Flag.action';

import {NotificationContext} from "@ctx/notification/notification.context";

// Components
import {Spinner} from "@comp/spinner";
import {Button} from "@comp/button";
import {Callout} from "@comp/callout";
import {Card, CardHead, CardFooter, CardBody} from "@comp/card";
import {H2} from "@comp/typography";
import {Textarea} from "@comp/form/textarea";
import {Badge} from "@comp/badge";
import {CloseButton} from "@act/shared/CloseButton";

// Types
import {TLink} from "@type/data/link";
import {TActionPropsMode} from "@act/shared/common.types";
import {TResult} from "@type/data/response";

export const FlagForm = (
    {link, mode = 'page'}: {link: TLink} & TActionPropsMode
): ReactNode => {
    const {add} = useContext(NotificationContext);
    const [state, action, pending] = useActionState<TResult|null>(FlagAction.bind(null, {link}), null);
    
    useEffect(() => {
        if (!pending && state) {
            add({
                type: state?.success ? 'success' : 'danger',
                title: (state?.success ? "Flagged successfully!" : "Couldn't flag that link!"),
                dismissible: false,
            })
        }
    }, [pending, state]);
    
    return (
        <form action={action} className={"w-full max-w-xl"}>
            <Card structured>
                <CardHead flex={false}>
                    <H2 className="float-start">Flag for moderation</H2>
                    <Badge badgeType={'theme'} className={"float-end"}>
                        {link.id}
                    </Badge>
                </CardHead>
                <CardBody>
                    {state?.success ? (
                        <Callout type="success">
                            <p>Flag report has been received!</p>
                        </Callout>
                    ) : (
                        <Textarea required withLabel={"Reason for flagging"} disabled={pending} name={"note"} rows={4} placeholder="Provide short reason for flag..."/>
                    )}
                </CardBody>
                {state?.success ? (
                    <CardFooter className={"!justify-end"}>
                        <CloseButton mode={mode} href={`/inspect/${link.id}`} label={'Back to inspection'} />
                    </CardFooter>
                ) : (
                    <CardFooter>
                        <CloseButton mode={mode} href={`/inspect/${link.id}`} label={'Back to inspection'} />

                        <Button btnType={"danger"} type={'submit'} disabled={pending} effects={true}>
                            {pending ? (<Spinner/>) : ("Send flag")}
                        </Button>
                    </CardFooter>
                    )
                }
            </Card>
        </form>
    )
}
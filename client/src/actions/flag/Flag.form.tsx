'use client';

import {useActionState} from "react";
import {useRouter} from 'next/navigation';
import cx from "classnames";

import {FlagAction} from './Flag.action';

// Components
import {Spinner} from "@comp/Spinner/Spinner";
import Button from "@comp/Button/Button";
import Callout from "@comp/Callout/Callout";
import Link from "next/link";
import {H2} from "@comp/Typography/H2";
import {Card} from "@comp/Card/Card";
import {CardHead} from "@comp/Card/CardHead";
import {CardBody} from "@comp/Card/CardBody";
import {CardFooter} from "@comp/Card/CardFooter";

// Types
import {LinkType} from "@type/data/Link";
import {Textarea} from "@comp/Form/Textarea";

export const FlagForm = ({
    link,
    mode = 'page',
 }: {
    link: LinkType,
    mode: 'page'|'modal'
}) => {
    const router = useRouter();
    const [state, action, pending] = useActionState(FlagAction.bind(null, {link}), undefined);

    return (
        <form action={action} className={"w-full max-w-xl"}>
            <Card structured>
                <CardHead>
                    <H2 className="float-start">
                        Flag for moderation
                    </H2>
                    <p className={cx(
                        'flex flex-row gap-2 items-center rounded-full py-1 px-2 text-sm float-end text-nowrap',
                        'bg-zinc-100 text-zinc-500',
                    )}>
                        <span className={cx(
                            'h-3 w-3 block rounded-full',
                            'before:content-[""] before:animate-ping before:h-3 before:w-3 before:block before:rounded-full',
                            'bg-zinc-500 before:bg-zinc-500',
                        )}/>
                        {link.id}
                    </p>
                </CardHead>
                <CardBody>
                    {state?.result?.success ? (
                        <Callout type="success">
                            <p>Flag report has been received!</p>
                        </Callout>
                    ) : (
                        <Textarea required withLabel={"Reason for flagging"} disabled={pending} name={"note"} rows={4} placeholder="Provide short reason for flag..."/>
                    )}
                </CardBody>
                {state?.result?.success ? (
                    <CardFooter className={"!justify-end"}>
                        {mode === 'page' && (<Link href={`/inspect/${link.id}`} passHref><Button type={'button'} btnType={'light'}>Back to inspection</Button></Link>)}
                        {mode === 'modal' && (<Button type={'button'} btnType={'light'} onClick={()=>router.back()}>Close</Button>)}
                    </CardFooter>
                ) : (
                    <CardFooter>
                        {mode === 'page' && (<Link href={`/inspect/${link.id}`} passHref><Button btnType={'light'} type={'button'}>Back to inspection</Button></Link>)}
                        {mode === 'modal' && (<Button btnType={'light'} type={'button'} onClick={()=>router.back()}>Close</Button>)}

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
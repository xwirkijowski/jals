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

// Types
import {LinkType} from "@type/data/Link";

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
        <form action={action} className="w-full max-w-xl flex flex-col bg-white shadow-xl rounded-xl">
            <div className={"p-8"}>
                <h2 className="font-bold text-zinc-900 text-2xl/tight sm:text-2xl/tight float-start">
                    Flag for moderation
                </h2>
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
            </div>
            {state?.result?.success ? (
                <div
                    className={cx(
                        'relative p-8 border-y border-zinc-900/15 w-full',
                    )}
                >
                    <Callout type="success">
                        <p>Flag report has been received!</p>
                    </Callout>
                </div>
            ) : (
                <div
                    className={cx(
                        'relative p-8 border-y border-zinc-900/15 grid grid-cols-2 w-full gap-4',
                    )}
                >
                    <textarea
                        required
                        disabled={pending}
                        name={"note"}
                        rows={4}
                        className={cx(
                            'flex-1 resize-none',
                            'bg-white col-span-full',
                            'transition-all duration-150',
                            'text-zinc-600 text-md caret-orange-500',
                            'outline-none',
                            'rounded-xl',
                            'border border-zinc-900/15 px-4 py-2',
                            'placeholder:text-zinc-600/50',
                            'group-focus-within:border-orange-500',
                            'disabled:border-orange-500',
                        )} placeholder="Provide short reason for flag..."/>
                </div>
            )}
            {state?.result?.success ? (
                <div className={"col-span-full flex gap-8 p-8 justify-end items-center"}>
                    {mode === 'page' && (<Link href={`/inspect/${link.id}`} passHref><Button type={'button'} btnType={'light'}>Back to inspection</Button></Link>)}
                    {mode === 'modal' && (<Button type={'button'} btnType={'light'} onClick={()=>router.back()}>Close</Button>)}
                </div>
            ) : (
                <div className={"col-span-full flex gap-8 p-8 justify-between items-center"}>
                    {mode === 'page' && (<Link href={`/inspect/${link.id}`} passHref><Button btnType={'light'} type={'button'}>Back to inspection</Button></Link>)}
                    {mode === 'modal' && (<Button btnType={'light'} type={'button'} onClick={()=>router.back()}>Close</Button>)}

                    <Button btnType={"danger"} type={'submit'} disabled={pending} effects={true}>
                        {pending ? (<Spinner/>) : ("Send flag")}
                    </Button>
                </div>
                )
            }
        </form>
    )
}
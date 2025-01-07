'use client';

import cx from "classnames";

import {useRouter} from "next/navigation";

// Components
import {Spinner} from "@comp/Spinner/Spinner";
import Button from "@comp/Button/Button";
import {Input} from "@comp/Form/Input";
import Callout from "@comp/Callout/Callout";

export const LogInForm = ({
    mode = 'page',
    action,
    state,
    pending,
  }: {
    mode: 'page'|'modal'
    action: any
    state: any,
    pending: boolean,
}) => {
    const router = useRouter()

    return (
        <form action={action} className="w-full max-w-xl flex flex-col bg-white shadow-xl rounded-xl">
            <div className={"p-8 flex flex-col gap-4"}>
                <h2 className="font-bold text-zinc-900 text-2xl/tight sm:text-2xl/tight float-start">
                    Input your authentication code
                </h2>
                <p className={cx('text-zinc-600 text-md')}>Alternatively you can use the magic link from the email.</p>
            </div>
            {state?.result?.success ? (
                <div
                    className={cx(
                        'relative p-8 border-y border-zinc-900/15 w-full',
                    )}
                >
                    <Callout type="success">
                        <p>Authentication successful!</p>
                    </Callout>
                </div>
            ) : (
                <div className={cx('relative p-8 border-y border-zinc-900/15 flex flex-col w-full gap-4')}>
                    <Input autoFocus={true} name={'code'} type={'text'} withLabel={'Code'} id={'login-code'} disabled={pending}
                           minLength={8} maxLength={8} pattern={'[0-9]{8}'} required/>
                </div>
            )}
            {state?.result?.success ? (
                <div className={"col-span-full flex gap-8 p-8 justify-end items-center"}>
                    <Button btnType={'light'} type={'button'} onClick={() => router.back()}>Close</Button>
                </div>
            ) : (
                <div className={"col-span-full flex gap-8 p-8 justify-between items-center"}>
                    <Button btnType={'light'} type={'button'} onClick={() => router.back()}>Close</Button>
                    <Button btnType={"primary"} type={'submit'} disabled={pending} effects={true}>
                        {pending ? (<Spinner/>) : ("Log In")}
                    </Button>
                </div>
                )
            }
        </form>
    )
}
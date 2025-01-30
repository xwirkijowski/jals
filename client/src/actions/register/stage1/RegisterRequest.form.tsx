'use client';

import cx from "classnames";

import {TActionProps} from "@act/shared/common.types";

// Components
import {setupErrorCallouts} from "@act/shared/mutation.utilities";
import Link from "next/link";
import {Spinner} from "@comp/Spinner";
import {Button} from "@comp/Button";
import {Input} from "@comp/form/Input";
import {Callout} from "@comp/Callout";
import {Card, CardHead, CardFooter, CardBody} from "@comp/Card";
import {H2, P} from "@comp/Typography";
import {CloseButton} from "@act/shared/CloseButton";

const list = cx(
    'text-zinc-600 text-md',
    'pl-6 relative',
    'before:content-[""] before:w-4 before:top-2.5 before:absolute before:h-[1px] before:bg-current before:left-0')

export const RegisterRequestForm = (
    {mode = 'page', action, state, pending}: TActionProps
) => {
    const errorCallouts = setupErrorCallouts(state);

    return (
        <form action={action} className={"w-full max-w-xl"}>
            <Card structured>
                <CardHead>
                    <H2 className="float-start">Create an account</H2>
                    <ul>
                        <li className={list}>Gain access to detailed statistics</li>
                        <li className={list}>Access user agent breakdown</li>
                        <li className={list}>See new clicks as they happen</li>
                        <li className={list}>Edit your links</li>
                    </ul>
                    <P>You will receive an authentication code to confirm your email address.</P>
                    <P>You will be able to input the code on the next step. Alternatively you can use the magic link from the email.</P>
                    {errorCallouts}
                </CardHead>
                <CardBody>
                    {state?.result?.success ? (
                        <Callout type="success">
                            <p>Authentication code has been send!</p>
                        </Callout>
                    ) : (
                        <Input autoFocus name={'email'} type={'email'} withLabel={'E-mail address'} id={'register-email'} disabled={pending} required/>
                    )}
                </CardBody>
                <CardFooter>
                    <CloseButton mode={mode} />
                    <div className={'flex gap-4'}>
                        <Link href={'/login'} passHref replace>
                            <Button btnType={'theme'} disabled={pending} effects={false}>Log In</Button>
                        </Link>
                        <Button btnType={"primary"} type={'submit'} disabled={pending} effects={true}>
                            {pending ? (<Spinner/>) : ("Request code")}
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </form>
    )
}
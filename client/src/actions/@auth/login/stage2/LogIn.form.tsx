'use client';

import {TActionProps} from "@act/shared/common.types";

// Components
import {setupErrorCallouts} from "@act/shared/mutation.utilities";
import {Spinner} from "@comp/spinner";
import {Button} from "@comp/button";
import {Callout} from "@comp/callout";
import {Input} from "components/form/input";
import {Card, CardHead, CardFooter, CardBody} from "@comp/card";
import {H2, P} from "@comp/typography";
import {CloseButton} from "@act/shared/CloseButton";

// @todo refactor to single deduplicated component with register stage 2

export const LogInForm = (
    {mode = 'page', action, state, pending}: TActionProps
) => {
    const errorCallouts = setupErrorCallouts(state);

    return (
        <form action={action} className={"w-full max-w-xl"}>
            <Card structured>
                <CardHead>
                    <H2 className="float-start">Input your authentication code</H2>
                    <P>We&apos;ve sent an authentication code to your email address.</P>
                    <P><strong>Your code is valid for only 5 minutes.</strong> If you don&apos;t see our message, check the spam folder.</P>
                    <P> If you did not receive it at all, please send us an email at <a href={'mailto:jals@wirkijowski.dev'} className="border-b border-b-current text-orange-500 hover:text-orange-400 trans font-bold">jals@wirkijowski.dev</a>.</P>
                    {errorCallouts}
                </CardHead>
                <CardBody>
                    {state?.result?.success ? (
                        <Callout type="success">
                            <p>Authentication successful!</p>
                        </Callout>
                    ) : (
                        <Input autoFocus={true} name={'code'} type={'text'} withLabel={'Code'} id={'login-code'} disabled={pending}
                               minLength={8} maxLength={8} pattern={'[0-9]{8}'} autoComplete={'off'} required/>
                    )}
                </CardBody>
                {state?.result?.success ? (
                    <CardFooter className={'!justify-end'}>
                        <CloseButton mode={mode} />
                    </CardFooter>
                ) : (
                    <CardFooter>
                        <CloseButton mode={mode} />
                        <Button btnType={"primary"} type={'submit'} disabled={pending} effects={true}>
                            {pending ? (<Spinner/>) : ("Log In")}
                        </Button>
                    </CardFooter>
                    )
                }
            </Card>
        </form>
    )
}
'use client';

import {useRouter} from "next/navigation";

import {TActionProps} from "@act/shared/common.types";

// Components
import {setupErrorCallouts} from "@act/shared/mutation.utilities";
import {Spinner} from "@comp/Spinner/Spinner";
import Callout from "@comp/Callout/Callout";
import {Button} from "@comp/Button/Button";
import {Input} from "@comp/Form/Input";
import {Card} from "@comp/Card/Card";
import {CardHead} from "@comp/Card/CardHead";
import {CardBody} from "@comp/Card/CardBody";
import {CardFooter} from "@comp/Card/CardFooter";
import {H2} from "@comp/Typography/H2";
import {P} from "@comp/Typography/P";

export const LogInForm = (
    {mode = 'page', action, state, pending}: TActionProps
) => {
    const router = useRouter()
    const errorCallouts = setupErrorCallouts(state);

    return (
        <form action={action} className={"w-full max-w-xl"}>
            <Card structured>
                <CardHead>
                    <H2 className="float-start">Input your authentication code</H2>
                    <P>We've sent an authentication code to your email address.</P>
                    <P><strong>Your code is valid for only 5 minutes.</strong> If you don't see our message, check the spam folder.</P>
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
                        <Button btnType={'theme'} onClick={() => router.back()}>Close</Button>
                    </CardFooter>
                ) : (
                    <CardFooter>
                        <Button btnType={'theme'} onClick={() => router.back()}>Close</Button>
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
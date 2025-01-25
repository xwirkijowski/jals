'use client';

import {TActionProps} from "@act/shared/common.types";

// Components
import Link from "next/link";
import {setupErrorCallouts} from "@act/shared/mutation.utilities";
import {Spinner} from "@comp/Spinner/Spinner";
import {Button} from "@comp/Button/Button";
import {Input} from "@comp/form/Input/Input";
import {Callout} from "@comp/Callout/Callout";
import {Card} from "@comp/Card/Card";
import {CardHead} from "@comp/Card/CardHead";
import {CardBody} from "@comp/Card/CardBody";
import {CardFooter} from "@comp/Card/CardFooter";
import {H2} from "@comp/Typography/H2";
import {P} from "@comp/Typography/P";
import {CloseButton} from "@act/shared/CloseButton";

export const LogInRequestForm = (
    {mode = 'page', action, state, pending}: TActionProps
) => {
    const errorCallouts = setupErrorCallouts(state);

    return (
        <form action={action} className={"w-full max-w-xl"}>
            <Card structured>
                <CardHead>
                    <H2 className="float-start">Log in</H2>
                    <P>If you have an account, you will receive an authentication code needed to log in to your account.</P>
                    <P>You will be able to input the code on the next step. Alternatively you can use the magic link from the email.</P>
                    {errorCallouts}
                </CardHead>
                <CardBody>
                    {state?.result?.success ? (
                        <Callout type="success">
                            <p>Authentication code has been send!</p>
                        </Callout>
                    ) : (
                        <Input autoFocus name={'email'} type={'email'} withLabel={'E-mail address'} id={'login-email'} disabled={pending} required/>
                    )}
                </CardBody>
                <CardFooter>
                    <CloseButton mode={mode} />
                    <div className={'flex gap-4'}>
                        <Link href={'/register'} passHref replace>
                            <Button btnType={'theme'} disabled={pending} effects={false}>Register</Button>
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
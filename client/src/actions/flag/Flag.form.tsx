'use client';

import {useActionState} from "react";
import {useRouter} from 'next/navigation';
import Link from "next/link";

// Actions
import {FlagAction} from './Flag.action';

// Components
import {Spinner} from "@comp/Spinner/Spinner";
import Button from "@comp/Button/Button";
import Callout from "@comp/Callout/Callout";
import {Card} from "@comp/Card/Card";
import {CardHead} from "@comp/Card/CardHead";
import {CardBody} from "@comp/Card/CardBody";
import {CardFooter} from "@comp/Card/CardFooter";
import {Textarea} from "@comp/Form/Textarea";
import {H2} from "@comp/Typography/H2";
import {Badge} from "@comp/Badge/Badge";

// Types
import {LinkType} from "@type/data/Link";
import {TActionPropsMode} from "@act/shared/common.types";

export const FlagForm = (
    {link, mode = 'page'}: {link: LinkType} & TActionPropsMode
) => {
    const router = useRouter();
    const [state, action, pending] = useActionState(FlagAction.bind(null, {link}), undefined);

    return (
        <form action={action} className={"w-full max-w-xl"}>
            <Card structured>
                <CardHead flex={false}>
                    <H2 className="float-start">Flag for moderation</H2>
                    <Badge badgeType={'theme'} ping>
                        {link.id}
                    </Badge>
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
                        {mode === 'page' && (<Link href={`/inspect/${link.id}`} passHref><Button btnType={'light'}>Back to inspection</Button></Link>)}
                        {mode === 'modal' && (<Button btnType={'light'} onClick={()=>router.back()}>Close</Button>)}
                    </CardFooter>
                ) : (
                    <CardFooter>
                        {mode === 'page' && (<Link href={`/inspect/${link.id}`} passHref><Button btnType={'light'}>Back to inspection</Button></Link>)}
                        {mode === 'modal' && (<Button btnType={'light'}onClick={()=>router.back()}>Close</Button>)}

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
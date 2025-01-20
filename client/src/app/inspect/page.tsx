import Link from "next/link";
import React from "react";

import {InspectForm} from "@act/inspect/Inspect.form";
import {Card} from "@comp/Card/Card";
import {H1} from "@comp/Typography/H1";
import {H2} from "@comp/Typography/H2";
import {P} from "@comp/Typography/P";

const Page = (): React.ReactNode => {
    return (
        <div className="flex flex-col justify-center items-center flex-1 gap-8">
            <div className="text-center">
                <H1>
                    Inspect your <span className={"text-orange-500"}>JALS</span> link
                </H1>
            </div>
            <div className="flex flex-col gap-4 justify-center text-center w-full max-w-xl">
                <InspectForm/>
                <P>
                    or create a <Link href="/" className="border-b border-b-current text-orange-500 hover:text-orange-400 trans font-bold">new link</Link>
                </P>

                <Card className={'mt-8'}>
                    <H2 className={'text-base'}>Did you know?</H2>
                    <P>You can easily inspect any URL by adding <code
                        className={'bg-zinc-100 dark:bg-gray-900 rounded px-1 py-0.5'}>/+</code> at the end.</P>
                </Card>
            </div>
        </div>
    )
}

export default Page;
import React from "react";
import * as motion from "motion/react-client";
import Link from "next/link";

// Components
import {InspectForm} from "@act/inspect/Inspect.form";
import {Card} from "@comp/card";
import {H1, H2, P} from "@comp/typography";
import {Container} from "@comp/container";

import {container, item} from "@lib/motion/stagger.fly";

const Page = (): React.ReactNode => {
    return (
        <Container>
            <motion.div variants={item} className="text-center">
                <H1>
                    Inspect your <span className={"text-orange-500"}>JALS</span> link
                </H1>
            </motion.div>
            <div className="flex flex-col gap-4 justify-center text-center w-full max-w-xl">
                <InspectForm variants={item} />
                <P variants={item}>
                    or create a <Link href="/" className="border-b border-b-current text-orange-500 hover:text-orange-400 trans font-bold">new link</Link>
                </P>

                <Card variants={container} className={'mt-8'}>
                    <H2 variants={item} className={'text-base'}>Did you know?</H2>
                    <P variants={item}>You can easily inspect any URL by adding <code
                        className={'bg-zinc-100 dark:bg-gray-900 rounded px-1 py-0.5'}>/+</code> at the end.</P>
                </Card>
            </div>
        </Container>
    )
}

export default Page;
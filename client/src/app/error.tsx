'use client';

import {ReactNode, useEffect} from "react";
import {motion} from "motion/react";
import cx from "classnames";
import Link from "next/link";

import {container, item} from "@lib/motion/stagger.fly";

import {Button} from "@comp/button";
import {H1, H2, P} from "@comp/typography";
import {Container} from "@comp/container";

export default function Error ({error, reset}): ReactNode {
    useEffect(() => {
        //
    }, [error])
    
    return (
        <Container>
            <motion.div variants={container} className={cx('flex-col gap-4 flex items-center max-w-lg w-full')}>
                <H1 variants={item} align={"center"}>Error!</H1>
                <H2 variants={item} align={"center"}>Unexpected error has occurred.</H2>
                <P variants={item} align={"center"}>If the issue does not resolve soon, please contact let us know.</P>
                <motion.div variants={container} className={'flex gap-4'}>
                    <Button variants={item} onClick={reset} btnType={'dark'} effects={true}>Try again</Button>
                    <Link href={`/`} passHref><Button variants={item} btnType={'primary'} effects={true}>Home</Button></Link>
                </motion.div>
            </motion.div>
        </Container>
    )
}
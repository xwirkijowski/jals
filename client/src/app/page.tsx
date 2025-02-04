import Link from "next/link";
import * as motion from "motion/react-client"

import {container, item} from "@lib/motion/stagger.fly";

// Components
import {ShortenForm} from "@act/@link/shorten/Shorten.form";
import {Card} from "@comp/card";
import {H1, H2, P} from "@comp/typography";
import {Container} from "@comp/container";
import {Anchor} from "@comp/anchor";

const Page = () => {
    return (
        <Container>
            <motion.div variants={item} className="text-center">
                <H1>Make your links <span className={"text-orange-500"}>shorter</span><br/> and <span className={"text-orange-500"}>observable</span></H1>
            </motion.div>

            <div className="flex flex-col gap-4 justify-center text-center w-full max-w-xl">
                <motion.div variants={item}>
                    <ShortenForm variants={item} />
                </motion.div>
                <P variants={item}>or get information about an <Anchor href="/inspect" bold>existing link</Anchor></P>
                <Card variants={container} className={'mt-8'}>
                    <H2 variants={item}>So what does this do?</H2>
                    <P variants={item}>You input your long URL into <span className={"font-bold"}>JALS</span>, and in return, you receive a unique short identifier. This is especially convenient for UTM tagging!</P>
                    <P variants={item}>Each time someone uses your new short link, we collect a timestamp of the visit and basic information about their browser and system (User-Agent header), and also their IP address.</P>
                    <P variants={item}>All data is collected during a single point of contact, when the user is being redirected. We do not use any cookies and do not track any visitors. <span className={"font-bold"}>We do not provide direct access to logged IP addresses.</span></P>
                    <P variants={item}>You can gain access to all visits (&quot;clicks&quot;) on your short links by creating a free account!</P>
                </Card>
            </div>
        </Container>
    )
}

export default Page;
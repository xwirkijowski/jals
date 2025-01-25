import Link from "next/link";

// Components
import {ShortenForm} from "@act/shorten/Shorten.form";
import {Card} from "@comp/Card/Card";
import {H1} from "@comp/Typography/H1";
import {H2} from "@comp/Typography/H2";
import {P} from "@comp/Typography/P";
import * as motion from "motion/react-client"

const container = {
    hidden: {
        opacity: 0,
        transform: "translateY(-1rem)",
    },
    show: {
        opacity: 1,
        transform: "translateY(0)",
        transition: {
            staggerChildren: .1
        }
    }
}

const item = {
    hidden: {
        opacity: 0,
        transform: "translateY(-1rem)",
    },
    show: {
        opacity: 1,
        transform: "translateY(0)",
    }
}

const Page = () => {
    return (
        <motion.div variants={container}  initial="hidden" animate="show" className="flex flex-col justify-center items-center flex-1 gap-8">
            <motion.div variants={item} className="text-center">
                <H1>Make your links <span className={"text-orange-500"}>shorter</span><br/> and <span className={"text-orange-500"}>observable</span></H1>
            </motion.div>

            <div className="flex flex-col gap-4 justify-center text-center w-full max-w-xl">
                <motion.div variants={item}>
                    <ShortenForm variants={item} />
                </motion.div>
                <P variants={item}>or get information about an <Link href="/inspect" className="border-b border-b-current text-orange-500 hover:text-orange-400 trans font-bold">existing link</Link></P>
                <Card variants={container} className={'mt-8'}>
                    <H2 variants={item}>So what does this do?</H2>
                    <P variants={item}>You input your long URL into <span className={"font-bold"}>JALS</span>, and in return, you receive a unique short identifier. This is especially convenient for UTM tagging!</P>
                    <P variants={item}>Each time someone uses your new short link, we collect a timestamp of the visit and basic information about their browser and system (User-Agent header), and also their IP address.</P>
                    <P variants={item}>All data is collected during a single point of contact, when the user is being redirected. We do not use any cookies and do not track any visitors. <span className={"font-bold"}>We do not provide direct access to logged IP addresses.</span></P>
                    <P variants={item}>You can gain access to all visits (&quot;clicks&quot;) on your short links by creating a free account!</P>
                </Card>
            </div>
        </motion.div>
    )
}

export default Page;
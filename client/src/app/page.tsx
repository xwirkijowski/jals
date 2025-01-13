import Link from "next/link";

// Components
import {ShortenForm} from "../actions/shorten/Shorten.form";

const Page = () => {
    return (
        <div className="flex flex-col justify-center items-center flex-1 gap-8">
            <div className="text-center">
                <h2 className="font-bold text-zinc-900 text-2xl/tight sm:text-5xl/tight">Make your links <span className={"text-orange-500"}>shorter</span><br/> and <span className={"text-orange-500"}>observable</span>
                </h2>
            </div>

            <div className="flex flex-col gap-4 justify-center text-center w-full max-w-xl">
                <ShortenForm />
                <p className="text-zinc-600">or get information about an <Link href="/inspect" className="border-b border-b-current text-orange-500 hover:text-orange-400 transition-all duration-150 font-bold">existing link</Link></p>
                <div className="flex flex-col gap-4 text-left w-full max-w-xl mt-8 text-zinc-600 text-md bg-white p-8 shadow-md shadow-zinc-900/20 rounded-xl">
                    <h3 className={"text-zinc-900 font-bold text-lg/tight sm:text-xl/tight"}>So what does this do?</h3>
                    <p className={""}>You input your long URL into <span className={"font-bold"}>JALS</span>, and in return, you receive a unique short identifier. This is especially convenient for UTM tagging!</p>
                    <p className={""}>Each time someone uses your new short link, we collect a timestamp of the visit and basic information about their browser and system (User-Agent header), and also their IP address.</p>
                    <p>All data is collected during a single point of contact, when the user is being redirected. We do not use any cookies and do not track any visitors. <span className={"font-bold"}>We do not provide direct access to logged IP addresses.</span></p>
                    <p>You can gain access to all visits ("clicks") on your short links by creating a free account!</p>
                </div>
            </div>

        </div>
    )
}

export default Page;
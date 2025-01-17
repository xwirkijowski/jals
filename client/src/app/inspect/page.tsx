import Link from "next/link";
import React from "react";

import {InspectForm} from "../../actions/inspect/Inspect.form";
import {Card} from "@comp/Card/Card";
import {H1} from "@comp/Typography/H1";
import {H2} from "@comp/Typography/H2";
import {P} from "@comp/Typography/P";

export default (): React.ReactNode => {
    return (
        <div className="flex flex-col justify-center items-center flex-1 gap-8">
            <div className="text-center">
                <h2 className="font-bold text-zinc-900 text-2xl/tight sm:text-5xl/tight">
                    Inspect your <span className={"text-orange-500"}>JALS </span>link
                </h2>
            </div>
            <div className="flex flex-col gap-4 justify-center text-center w-full max-w-xl">
                <InspectForm/>
                <P>
                    or create a <Link href="/" className="border-b border-b-current text-orange-500 hover:text-orange-400 trans font-bold">new link</Link>
                </P>

                <div
                    className="flex flex-col gap-4 text-left w-full max-w-xl mt-8 text-zinc-600 text-md bg-white p-8 shadow-md shadow-zinc-900/20 rounded-xl">
                    <h3 className={"text-zinc-900 font-bold text-lg/tight sm:text-xl/tight"}>Did you know?</h3>
                    <p className={""}>You can easily inspect any URL by adding <code
                        className={'bg-zinc-100 rounded px-1 py-0.5'}>/+</code> at the end.</p>
                </div>
            </div>
        </div>
    )
}
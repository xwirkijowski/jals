
// Metadata
import {Metadata, ResolvingMetadata} from "next";
export const generateMetadata = async (
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> => {
   const linkId = (await params).linkId;
   return {
       title: `Inspect ${linkId}`,
   }
}

type Props = {
    params: Promise<{linkId: string}>
    searchParams: Promise<{[key: string]: string | undefined}>
}

// Query
import { gql } from "@apollo/client";
const LINK = gql`
    query Link($linkId: ID!) {
        link(linkId: $linkId) {
            target
            active
            clickCount
            flagCount
            flags {
                note
                createdAt
            }
            createdAt
            updatedAt
            version
        }
    }
`;

import {getClient} from '../../../apollo-client';

const LinkPage = async (
    {params}
) => {
    const linkId = (await params).linkId;
    const {data: {link}} = await getClient().query({query: LINK, variables: {linkId: linkId}});

    return (
        <div className="flex flex-col justify-center items-center text-left flex-1 gap-8">
            {link.flagCount > 0 ? (
                    <div
                        className="max-w-xl  text-white bg-orange-500 p-4 items-center shadow-xl shadow-orange-500/20 rounded-xl w-full flex gap-4">
                        <h3 className={"font-bold uppercase text-sm"}>Warning</h3> |
                        <p>This link has been flagged {link.flagCount} {link.flagCount === 1 ? 'time' : 'times'}!</p>
                    </div>
                ) :
                null
            }
            <div className="w-full max-w-xl flex flex-col bg-white shadow-xl rounded-xl">
                <h2 className="font-bold text-zinc-900 text-2xl/tight sm:text-2xl/tight p-8">
                    Inspecting link<br/><span className={"text-orange-500"}>{linkId}</span>
                </h2>
                <div className={"p-8 border-y grid grid-cols-2 w-full gap-4"}>
                    <div className={"w-full gap-2 flex flex-col col-span-full"}>
                        <h3 className={"font-bold"}>Target URL</h3>
                        <p className={"w-full px-4 py-2 bg-zinc-200 text-zinc-600 rounded-xl border border-transparent font-mono text-wrap break-words overflow-hidden"}>{link.target}</p>
                    </div>
                    <div className={"gap-2 flex flex-col"}>
                        <h3 className={"font-bold"}>Creation time</h3>
                        <p className={"text-zinc-600"}>{new Date(link.createdAt).toLocaleString()}</p>
                    </div>
                    <div className={"gap-2 flex flex-col"}>
                        <h3 className={"font-bold"}>Click count</h3>
                        <p className={"text-zinc-600"}>{link.ClickCount > 0 ? link.clickCount : "No clicks yet"}</p>
                    </div>
                    <div className={"gap-2 flex flex-col"}>
                        <h3 className={"font-bold"}>Last modified</h3>
                        <p className={"text-zinc-600"}>{new Date(link.createdAt).toLocaleString()}</p>
                    </div>
                    <div className={"gap-2 flex flex-col"}>
                        <h3 className={"font-bold"}>Version</h3>
                        <p className={"text-zinc-600"}>{link.version}</p>
                    </div>
                </div>
                <div className={"col-span-full flex gap-8 p-8 justify-between items-center"}>
                    <p className={"text-zinc-900"}>Is this link malicious or inappropriate?</p>
                    <button className={"duration-150 transition-all px-4 py-3 text-base bg-red-500 text-white block text-nowrap rounded-xl font-bold shadow-xl shadow-red-500/20 hover:scale-95 hover:bg-red-400 hover:shadow-md"}>Flag for moderation</button>
                </div>
            </div>
        </div>
    )
}

export default LinkPage;
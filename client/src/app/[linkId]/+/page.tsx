import {Metadata, ResolvedMetadata, ResolvingMetadata} from "next";
import {Fragment} from "react";

type Props = {
    params: Promise<{linkId: string}>
    searchParams: Promise<{[key: string]: string | undefined}>
}


// Query
import { gql } from "@apollo/client";
const linkQuery = gql`
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

import {getClient, query} from "../../../apollo-client";


const generateMetadata = async (
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> => {
   const linkId = (await params).linkId;

   return {
       title: `Inspect ${linkId}`,
   }
}

export {generateMetadata};

const LinkPage = async (
    {params}: Promise<{linkId: string}>
) => {
    const linkId = (await params).linkId;
    const {data: {link}} = await getClient().query({query: linkQuery, variables: {linkId: linkId}});

    return (
        <div className="flex flex-col justify-center items-center text-left flex-1">
            <div className="w-full max-w-xl gap-8 flex flex-col">
                <h2 className="font-bold text-zinc-900 text-2xl/tight sm:text-2xl/tight">
                    Inspecting link<br/><span className={"text-orange-500"}>{linkId}</span>
                </h2>
                {link.flagCount > 0 ? (
                        <div
                            className="animate-pulse text-white bg-orange-500 p-4 items-center shadow-xl shadow-orange-500/20 rounded-xl w-full flex gap-4">
                            <h3 className={"font-bold uppercase text-sm"}>Warning</h3> |
                            <p>This link has been flagged {link.flagCount} {link.flagCount === 1 ? 'time' : 'times'} !</p>
                        </div>
                    ) :
                    null
                }
                <div className={"w-full gap-2 flex flex-col"}>
                    <h3 className={"font-bold"}>Target URL</h3>
                    <p className={"w-full px-4 py-2 bg-zinc-200 text-zinc-600 rounded-xl border border-transparent font-mono text-wrap break-words overflow-hidden"}>{link.target}</p>
                </div>
                <div className={"grid grid-cols-2 grid-rows-2 w-full gap-4"}>
                    <div>
                        <h3 className={"font-bold"}>Creation time</h3>
                        <p className={"text-zinc-600"}>{new Date(link.createdAt).toLocaleString()}</p>
                    </div>
                    <div>
                        <h3 className={"font-bold"}>Click count</h3>
                        <p className={"text-zinc-600"}>{link.ClickCount > 0 ? link.clickCount : "No clicks yet"}</p>
                    </div>
                    <div>
                        <h3 className={"font-bold"}>Last modified</h3>
                        <p className={"text-zinc-600"}>{new Date(link.createdAt).toLocaleString()}</p>
                    </div>
                    <div>
                        <h3 className={"font-bold"}>Version</h3>
                        <p className={"text-zinc-600"}>{link.version}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LinkPage;
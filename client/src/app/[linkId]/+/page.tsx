import {Metadata, ResolvedMetadata, ResolvingMetadata} from "next";
import {Fragment} from "react";

type Props = {
    params: Promise<{linkId: string}>
    searchParams: Promise<{[key: string]: string | undefined}>
}

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

    return (
        <Fragment>
            <h1>Link inspection page</h1>
            <h2>{linkId}</h2>
        </Fragment>
    )
}

export default LinkPage;
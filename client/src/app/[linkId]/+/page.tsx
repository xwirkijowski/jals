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

import cx from 'classnames';
import {permanentRedirect} from "next/navigation";

const LinkPage = async (
    {params}
) => {
    const linkId = (await params).linkId;

    permanentRedirect('/inspect/'+linkId);
}

export default LinkPage;
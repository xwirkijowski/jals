import {permanentRedirect} from "next/navigation";

const Page = async (
    {params}
) => {
    const linkId = (await params).linkId;

    permanentRedirect('/inspect/'+linkId);
}

export default Page;
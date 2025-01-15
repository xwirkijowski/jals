import {permanentRedirect} from "next/navigation";

const LinkPage = async (
    {params}
) => {
    const linkId = (await params).linkId;

    permanentRedirect('/inspect/'+linkId);
}

export default LinkPage;
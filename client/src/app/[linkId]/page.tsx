
// Metadata
import { Metadata } from 'next';
export const metadata: Metadata = {
    title: 'Redirecting...'
}

const LinkPage = async (
    {params}
) => {
    const linkId = (await params).linkId;

    return (
        <h1>Redirection... {linkId}</h1>
    )
}

export default LinkPage;
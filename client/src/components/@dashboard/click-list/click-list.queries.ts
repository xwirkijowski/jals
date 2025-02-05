import {gql} from "@apollo/client";

export const CLICKS = gql`
    query ClicksList($linkId: ID, $perPage: Int, $page: Int) {
        clicks(linkId: $linkId, perPage: $perPage, page: $page) {
            nodes {
                id
                userAgent
                platform
                isMobile
                createdAt
            }
            pageInfo {
                total
                perPage
                pageCount
                currentPage
                hasNextPage
                hasPreviousPage
            }
        }
    }
`;
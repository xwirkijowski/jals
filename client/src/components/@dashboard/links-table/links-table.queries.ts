import {gql} from "@apollo/client";

export const LINKS = gql`
    query LinksTable($createdBy: ID, $perPage: Int, $page: Int) {
        links(createdBy: $createdBy, perPage: $perPage, page: $page) {
            nodes {
                id
                target
                active
                caution
                clickCount
                flagCount
                updatedAt
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
import {gql} from "@apollo/client";

export const LINK_REDIRECT = gql`
    query LinkRedirect($linkId: ID!) {
        link(linkId: $linkId) {
            id
            target
            active
            flagCount
            caution
        }
    }
`;


export const LINK_PUBLIC = gql`
    query Link($linkId: ID!) {
        link(linkId: $linkId) {
            id
            target
            active
            caution
            flagCount
            createdAt
            updatedAt
            version
        }
    }
`;

export const LINK_OWNER = gql`
    query LinkOwner($linkId: ID!) {
        link(linkId: $linkId) {
            id
            target
            active
            caution
            clickCount
            flagCount
            flags {
                note
                createdAt
            }
            createdAt
            createdBy {
                email
            }
            updatedAt
            version
        }
    }
`;

export const LINK_FULL = gql`
    query LinkFull($linkId: ID!) {
        link(linkId: $linkId) {
            id
            target
            active
            caution
            clickCount
            flagCount
            flags {
                note
                createdAt
            }
            createdAt
            createdBy {
                email
            }
            updatedAt
            updatedBy {
                email
            }
            version
        }
    }
`;
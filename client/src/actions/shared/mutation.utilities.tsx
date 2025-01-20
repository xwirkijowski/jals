import React from "react";

import {Callout} from "@comp/Callout/Callout";

export const setupErrorCallouts = (state: any) => {
    const errorCallouts: React.JSX.Element[] = [];

    if (state && state?.result?.success === false) {
        state.result.errors.map(item => {
            let content;

            if (item.code === 'INVALID_CREDENTIALS') {
                content = "Looks like you don't have an account yet!";
            } else if (item.code === 'ALREADY_EXISTS') {
                content = 'Looks like you already have an account!';
            } else if (item.code === 'INVALID_CODE') {
                content = 'Code invalid or already used!'
            } else if (item?.code) {
                content = item.msg
                    ? `${item.message} (${item.code})`
                    : `Error occurred, try again later! (${item.code})`;
            } else {
                content = 'Unknown error occurred, try again later!';
            }

            errorCallouts.push(
                <Callout type="danger" title={'Failed'}>
                    <p>{content}</p>
                </Callout>
            )
        })
    }

    return errorCallouts;
}
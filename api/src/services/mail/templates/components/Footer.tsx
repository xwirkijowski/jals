import React from "react";

import {section, paragraphSmall} from "../styles";

export const Footer = ({requestId}: {requestId: string}) => {
    return (
        <div style={{
            ...section,
            borderTop: '1px solid #e5e7eb'
        }}>
            <p style={paragraphSmall}>
                You have received this email because someone requested an
                authentication code to access an account associated with your
                email address.
            </p>
            <p style={paragraphSmall}>
                If you do not have an account, you don't need to do anything. We
                didn't create a new account yet. You can safely ignore this
                email.
            </p>
            <p style={paragraphSmall}>
                You can reply to this email to request removal of your email
                from our logs.
            </p>
            <p style={{
                ...paragraphSmall,
                color: '#52525b',
                marginTop: '16px',
                marginBottom: 0,
                textAlign: 'center',
            }}>
                Request ID: {requestId}
            </p>
        </div>
    )
}
import React, {CSSProperties} from "react";

// Types
import {EmailDataInterface} from "../service";

const Head = () => {
    return (
        <head>
            <title>Your JALS authentication code</title>
            <link href="https://fonts.googleapis.com/css?family=Montserrat:thin,extra-light,light,100,200,300,400,500,600,700,800" rel="stylesheet" />
        </head>
    )
}

const section: CSSProperties = {
    padding: '32px',
}

const paragraph: CSSProperties = {
    fontSize: '16px',
    lineHeight: '1.5',
    color: '#18181b',
    marginTop: 0,
    marginBottom: '16px'
}

const paragraphSmall: CSSProperties = {
    fontSize: '12px',
    lineHeight: '1.25',
    color: '#a1a1aa',
    textAlign: 'justify',
    marginTop: 0,
    marginBottom: '16px'
}

const Footer = ({requestId}: {requestId: string}) => {
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

const Header = () => {
    return (
        <div style={{
            ...section,
            borderBottom: '1px solid #e5e7eb',
        }}>
            <div>
                <p style={{
                    margin: 0,
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#18181b',
                }}>
                    JALS
                    <span style={{
                        color: '#f97316'
                    }}>v2</span>
                </p>
            </div>
            <div>
                <a href={'https://github.com/xwirkijowski/jals'}>GitHub</a>
            </div>
        </div>
    )
}

export const LoginEmail = (data: EmailDataInterface): React.ReactNode => {
    return (
        <html lang={"en"}>
            <Head/>
            <body style={{
                margin: '32px auto',
                padding: 0,
                fontFamily: 'Montserrat, Helvetica Neue, Helvetica, Arial, sans-serif',
                maxWidth: '576px',
            }}>
                <div style={{
                    border: '2px solid #f97316',
                    borderRadius: '12px',
                }}>
                    <Header />
                    <div style={section}>
                        <h1 style={{
                            fontSize: '24px',
                            fontWeight: 'bold',
                            color: '#18181b',
                        }}>Your authentication code</h1>
                        <p style={{
                            ...paragraph,
                        }}>Use the single use code below to log in to your JALS account.</p>
                        <p style={{
                            fontSize: '24px',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            lineHeight: 1,
                            borderRadius: '12px',
                            padding: '16px 16px 16px 32px',
                            letterSpacing: '16px',
                            background: '#e4e4e7',
                            color: '#18181b',
                        }}>{data.authCode}</p>
                        <p style={{
                            ...paragraph,
                            textAlign: 'center',
                        }}>This code is valid for 5 minutes</p>
                        <p>Request agent: {data.userAgent}</p>
                        <p>Request IP address: {data.userAddr}</p>
                    </div>
                    <Footer requestId={data.requestId}/>
                </div>
            </body>
        </html>
    )
}
import React from "react";

// Config
import {config} from '../../../../config';
const frontendAddr: string = config.settings.general.frontendAddr;

// Components
import {Head} from "./components/Head";
import {Header} from "./components/Header";
import {Footer} from "./components/Footer";

// Types
import {IEmailData} from "../service";

import styles, {authCodeWrapper} from './styles';

export const LoginEmail = (data: IEmailData): React.ReactNode => {
    const authCode = [];

    data.authCode.code.split('').forEach((c, i) => authCode.push(
        <p key={i} style={{
            ...styles.authCode,
            ...(i === 3 && {marginRight: '4px'}),
            ...(i === 4 && {marginLeft: '4px'})
        }}>
            {c}
        </p>
    ))

    return (
        <html lang={"en"}>
            <Head/>
            <body style={styles.body}>
                <div style={{
                    border: '2px solid #f97316',
                    borderRadius: '12px',
                }}>
                    <Header />
                    <div style={styles.section}>
                        <h1 style={{
                            fontSize: '24px',
                            fontWeight: 'bold',
                            color: '#18181b',
                        }}>Your authentication code</h1>
                        <p style={styles.paragraph}>
                            {data.action === 'LOGIN' && ('Use the single use code below to log in to your JALS account.')}
                            {data.action === 'REGISTER' && ('Use the single use code below to create your new JALS account.')}
                        </p>
                        <div style={styles.authCodeWrapper}>
                            {authCode}
                        </div>
                        <p style={{
                            ...styles.paragraph,
                            textAlign: 'center',
                        }}>or</p>
                        <p style={{
                            ...styles.paragraph,
                            textAlign: 'center',
                        }}>use <a href={`${frontendAddr}/${data.action.toLowerCase()}/magic/${data.authCode.authCodeId}`}>this magic link</a> to log in</p>
                        <p style={{
                            ...styles.paragraph,
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
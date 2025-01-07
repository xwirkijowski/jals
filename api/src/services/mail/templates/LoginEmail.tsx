import React from "react";
import {EntityId} from "redis-om";

import {config} from '../../../../config';
const frontendAddr: string = config.settings.general.frontendAddr;

// Components
import {Head} from "./components/Head";
import {Header} from "./components/Header";
import {Footer} from "./components/Footer";

// Types
import {EmailDataInterface} from "../service";

import styles from './styles';

export const LoginEmail = (data: EmailDataInterface): React.ReactNode => {
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
                        <p style={{
                            ...styles.paragraph,
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
                        }}>{data.authCode.code}</p>
                        <p style={{
                            ...styles.paragraph,
                            textAlign: 'center',
                        }}>or</p>
                        <p style={{
                            ...styles.paragraph,
                            textAlign: 'center',
                        }}>use <a href={`${frontendAddr}/login/magic/${data.authCode[EntityId]}`}>this magic link</a> to log in</p>
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
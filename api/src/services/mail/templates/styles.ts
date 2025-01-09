import {CSSProperties as CSS} from "react";

export const body: CSS = {
    margin: '32px auto',
    padding: 0,
    fontFamily: 'Montserrat, Helvetica Neue, Helvetica, Arial, sans-serif',
    maxWidth: '576px',
}

export const section: CSS = {
    padding: '32px',
}

export const paragraph: CSS = {
    fontSize: '16px',
    lineHeight: '1.5',
    color: '#18181b',
    marginTop: 0,
    marginBottom: '16px',
}

export const paragraphSmall: CSS = {
    fontSize: '12px',
    lineHeight: '1.25',
    color: '#a1a1aa',
    textAlign: 'justify',
    marginTop: 0,
    marginBottom: '16px',
}

export const authCode: CSS = {
    display: 'inline-block',
    fontSize: '24px',
    fontWeight: 'bold',
    lineHeight: 1,
    color: '#18181b',
    margin: 0,
    padding: '0 4px',
}

export const authCodeWrapper: CSS = {
    borderRadius: '12px',
    padding: '16px 12px',
    background: '#e4e4e7',
    textAlign: 'center',
}

const styles = {
    body,
    section,
    paragraph,
    paragraphSmall,
    authCode,
    authCodeWrapper,
}

export default styles;
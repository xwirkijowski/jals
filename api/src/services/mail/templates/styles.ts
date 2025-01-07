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
    marginBottom: '16px'
}

export const paragraphSmall: CSS = {
    fontSize: '12px',
    lineHeight: '1.25',
    color: '#a1a1aa',
    textAlign: 'justify',
    marginTop: 0,
    marginBottom: '16px'
}

const styles = {
    body,
    section,
    paragraph,
    paragraphSmall,
}

export default styles;
import React from "react";

import { section } from '../styles';

export const Header = (): React.ReactNode => {
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
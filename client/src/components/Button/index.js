import React from 'react';
import styles from './Button.module.scss';

const Button = ({element = 'a', color, label, type, inline = false, href}) => {
	const colorClass = (color) ? styles['button-'+color] : '';
	const inlineClass = (inline) ? styles['button-inline'] : '';

	if (element === 'a') return (<a className={`${styles.button} ${colorClass} ${inlineClass}`} href={href}>{label}</a>);
	if (element === 'button') return (<button type={type} className={`${styles.button} ${inlineClass}`}>{label}</button>);
};

export default Button;
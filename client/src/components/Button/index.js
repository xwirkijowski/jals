import React from 'react';
import styles from './Button.module.scss';

const Button = ({element = 'a', color, label, type, inline = false, href, onClick, size}) => {
	const colorClass = (color) ? styles['button-'+color] : '';
	const inlineClass = (inline) ? styles['button-inline'] : '';
	const sizeClass = (size) ? styles['button-'+size] : '';

	if (element === 'a') return (<a className={`${styles.button} ${colorClass} ${sizeClass} ${inlineClass}`} href={href} onClick={onClick}>{label}</a>);
	if (element === 'button') return (<button type={type} className={`${styles.button} ${colorClass} ${sizeClass} ${inlineClass}`} onClick={onClick}>{label}</button>);
};

export default Button;
import React from 'react';
import styles from './Notification.module.scss';
import Button from "../Button";

const Notification = ({color, dismissible, onClick, children}) => {
	const colorClass = (color) ? styles['notification-'+color] : '';
	const dismissibleClass = (dismissible) ? styles['notification-dismissible'] : '';

	return (
		<div className={`${styles.notification} ${dismissibleClass} ${colorClass}`}>
			{(dismissible) ? (
				<p>{children}</p>
			) : {children}}
			{(dismissible) && <Button inline element="button" color={color} label={(typeof dismissible === 'string') ? dismissible : 'Dismiss'} size="sm" onClick={onClick} />}
		</div>
	)
};

export default Notification;
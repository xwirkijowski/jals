import React from 'react';
import styles from './Notification.module.scss';

const Notification = ({color, children}) => {
	const colorClass = (color) ? styles['notification-'+color] : '';

	return (
		<div className={`${styles.notification} ${colorClass}`}>
			{children}
		</div>
	)
}

export default Notification;
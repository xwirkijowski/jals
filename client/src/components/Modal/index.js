import React from 'react';
import styles from './Modal.module.scss';

const Modal = ({open, children}) => {
	const openClass = open ? styles['modal-open'] : '';

	return (
		<div className={`${styles.modal} ${openClass}`}>
			{children}
		</div>
	)
};

export default Modal;
import React from 'react';
import styles from './Column.module.scss';

const Column = ({children, shrink}) => {
	const shrinkClass = (shrink) ? styles['column-shrink'] : '';

	return (
		<div className={`${styles.column} ${shrinkClass}`}>
			{children}
		</div>
	)
}

export default Column;
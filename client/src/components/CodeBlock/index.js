import React from 'react';
import styles from './CodeBlock.module.scss';

const CodeBlock = ({children}) => {
	return (
		<pre className={styles['code-block']}>
			<code>
				{children}
			</code>
		</pre>
	)
};

export default CodeBlock;
import React from 'react';
import styles from './Header.module.scss';

const Header = () => {
	return (
		<header className={styles.header}>
			<div className={styles.header__project}>
				<h1 className={styles.header__project__name}>JALS</h1>
				<p className={styles.header__project__tagline}>Just another link shortener</p>
			</div>
			<div className={styles.header__branding}>
				<h1 className={"disabled"}>Wirkijowski<span>.dev</span></h1>
			</div>
		</header>
	)
};

export default Header;
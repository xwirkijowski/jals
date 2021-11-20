import React from 'react';
import styles from './Footer.module.scss';

const Footer = () => {
	return (
		<footer className={styles.footer}>
			<ul className={styles['link-list']}>
				<li className={styles['link-list__item']}><a className={styles['link-list__item__link']} href="https://github.com/ashtonofsleep/jals" rel="noopener noreferrer">GitHub</a></li>
			</ul>
			<p className={`${styles.footer__copyright}  ${'disabled'}`}>Made by Sebastian Wirkijowski</p>
		</footer>
	)
};

export default Footer;
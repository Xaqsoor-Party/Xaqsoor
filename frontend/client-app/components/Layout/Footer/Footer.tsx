import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        <footer className={styles.footer}>
            <p>
                © {currentYear} Xaqsoor. All rights reserved.{' '}
                <span>
          | Developed by{' '}
                    <a
                        href="https://asalsolutions.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.link}
                    >
            Asal Solutions
          </a>
        </span>
            </p>
        </footer>
    );
};

export default Footer;
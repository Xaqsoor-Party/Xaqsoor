import styles from './Footer.module.css';
import { FiFacebook, FiTwitter, FiLinkedin } from 'react-icons/fi'; // Importing social media icons

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                {/* Left Section */}
                <div className={styles.leftSection}>
                    <h2 className={styles.footerTitle}>Xaqsoor Party</h2>
                    <p className={styles.footerDescription}>
                        A political party committed to building a just, prosperous, and united Somalia.
                    </p>
                </div>

                {/* Middle Section */}
                <div className={styles.middleSection}>
                    <h3 className={styles.sectionTitle}>Quick Links</h3>
                    <ul className={styles.linkList}>
                        <li><a href="/about" className={styles.link}>About Us</a></li>
                        <li><a href="/contact" className={styles.link}>Contact</a></li>
                        <li><a href="/privacy-policy" className={styles.link}>Privacy Policy</a></li>
                        <li><a href="/terms" className={styles.link}>Terms & Conditions</a></li>
                    </ul>
                </div>

                {/* Right Section (Social Media Icons) */}
                <div className={styles.rightSection}>
                    <h3 className={styles.sectionTitle}>Follow Us</h3>
                    <div className={styles.socialIcons}>
                        <a href="https://facebook.com" className={styles.socialIcon}>
                            <FiFacebook size={24} />
                        </a>
                        <a href="https://twitter.com" className={styles.socialIcon}>
                            <FiTwitter size={24} />
                        </a>
                        <a href="https://linkedin.com" className={styles.socialIcon}>
                            <FiLinkedin size={24} />
                        </a>
                    </div>
                </div>
            </div>

            {/* Footer Bottom (Copyright) */}
            <div className={styles.footerBottom}>
                <p className={styles.copyright}>© 2025 Xaqsoor Party. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;

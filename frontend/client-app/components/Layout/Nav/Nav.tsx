import React, { useState } from "react";

import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/common/LanguageSwitcher/LanguageSwitcher";
import styles from "./Nav.module.css";
import {FiMenu, FiX} from "react-icons/fi";
import Link from "next/link";

const Nav = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { language } = useLanguage();

    const navItems = [
        { id: 1, label: { en: "Home", so: "Bogga Hore" }, path: "/" },
        { id: 2, label: { en: "About", so: "Nagu Saabsan" }, path: "/about" },
        { id: 3, label: { en: "Membership", so: "Xubinimada" }, path: "/membership" },
        { id: 4, label: { en: "Contact", so: "Nala Soo Xiriir" }, path: "/contact" },
    ];

    return (
        <nav className={styles.nav}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    Xaqsoor
                </Link>

                {/* Desktop Navigation */}
                <div className={styles.navItems}>
                    {navItems.map((item) => (
                        <Link
                            key={item.id}
                            href={item.path}
                            className={styles.navLink}
                        >
                            {item.label[language]}
                        </Link>
                    ))}
                    <LanguageSwitcher />
                </div>

                {/* Mobile Menu Button */}
                <button
                    className={styles.mobileMenuButton}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-expanded={mobileMenuOpen}
                    aria-label={mobileMenuOpen ?
                        language === 'en' ? "Close menu" : "Xidhiidhka xir" :
                        language === 'en' ? "Open menu" : "Fur menu"
                    }
                >
                    {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
            </div>

            {/* Mobile Navigation */}
            <div className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.show : ''}`}>
                <div className={styles.mobileNavItems}>
                    {navItems.map((item) => (
                        <a
                            key={item.id}
                            href={item.path}
                            className={styles.mobileNavLink}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {item.label[language]}
                        </a>
                    ))}
                    <div style={{ padding: `var(--spacing-md) var(--spacing-xl)` }}>
                        <LanguageSwitcher />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Nav;
import React from 'react';
import styles from './Navbar.module.css';
import { AvatarDropdown } from "./AvatarDropdown/AvatarDropdown";
import Link from "next/link";
import { FiMenu } from 'react-icons/fi';
import LanguageSwitcher from "@/components/common/LanguageSwitcher/LanguageSwitcher";

interface NavbarProps {
    onMenuToggle: () => void;
    isMobile: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({onMenuToggle, isMobile }) => {

    return (
        <header className={styles.navbar}>
            <div className={styles.leftSection}>
                {/* Mobile Burger Menu - Only shows on mobile */}
                {isMobile && (
                    <button
                        className={styles.menuButton}
                        onClick={onMenuToggle}
                        aria-label="Toggle menu"
                    >
                        <FiMenu size={24} />
                    </button>
                )}

                <Link href="/" passHref>
                    <div className={styles.logoContainer}>
                        <span className={styles.logoText}>Xaqsoor</span>
                    </div>
                </Link>
            </div>

            <div className={styles.rightSection}>
                <LanguageSwitcher />
                <AvatarDropdown  />
            </div>
        </header>
    );
};
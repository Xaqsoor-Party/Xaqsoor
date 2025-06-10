import React, {useEffect, useRef, useState} from 'react';
import {FiChevronDown, FiLogOut, FiUser} from 'react-icons/fi';
import styles from '../Navbar.module.css';
import {useRouter} from "next/router";
import {useAuthentication} from "@/auth/AuthProvider";
import useAuthApi from "@/api/hooks/useAuthApi";

export const AvatarDropdown = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const {setAuthToken, user} = useAuthentication();
    const {logout} = useAuthApi();

    const firstName = user?.firstName || "Unknown";
    const imgUrl = user?.profileImageUrl || "";

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setAuthToken(null, null);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const goToProfile = () => {
        void router.push('/profile');
    };

    const getDisplayName = (name: string) => name.length > 10 ? `${name.substring(0, 8)}...` : name;

    return (
        <div className={styles.avatarDropdown} ref={dropdownRef}>
            <button
                className={styles.avatarButton}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                aria-expanded={isDropdownOpen}
                aria-label="User menu"
            >
                <div className={styles.avatar}>
                    {imgUrl ? (
                        <img
                            src={imgUrl}
                            alt={`${firstName}'s profile`}
                            className={styles.avatarImage}
                        />
                    ) : (
                        <span className={styles.avatarInitial}>
                            {firstName.charAt(0).toUpperCase()}
                        </span>
                    )}
                </div>
                <span className={styles.userName} title={firstName}>
                    {getDisplayName(firstName)}
                </span>
                <FiChevronDown className={`${styles.chevron} ${isDropdownOpen ? styles.rotated : ''}`}/>
            </button>

            {isDropdownOpen && (
                <div className={styles.dropdownMenu}>
                    <button className={styles.dropdownItem} onClick={goToProfile}>
                        <FiUser className={styles.dropdownIcon}/>
                        <span>Profile</span>
                    </button>
                    <button className={styles.dropdownItem} onClick={handleLogout}>
                        <FiLogOut className={styles.dropdownIcon}/>
                        <span>Logout</span>
                    </button>
                </div>
            )}
        </div>
    );
};
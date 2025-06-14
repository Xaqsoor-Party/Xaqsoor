import React, {useState} from 'react';
import {useRouter} from 'next/router';
import Link from 'next/link';
import {FiChevronDown, FiChevronRight, FiHome, FiX,} from 'react-icons/fi';

import styles from './Sidebar.module.css'
import {
    FaBullhorn,
    FaCalendarAlt,
    FaCogs, FaHandHoldingHeart,
    FaImages,
    FaMapMarkedAlt,
} from "react-icons/fa";

import {AiOutlineDoubleLeft, AiOutlineDoubleRight} from "react-icons/ai";
import {useLanguage} from "@/context/LanguageContext";
import {getTranslations} from "@/translations";
import {ImNewspaper} from "react-icons/im";

interface NavItem {
    title: string;
    path: string;
    icon: React.ReactNode;
    roles?: string[];
    items?: NavItem[];
}

interface SideNavProps {
    isOpen: boolean;
    onClose: () => void;
    isMobile: boolean;
}

const Sidebar: React.FC<SideNavProps> = ({isOpen, onClose, isMobile}) => {
    const router = useRouter();
    const {language} = useLanguage();
    const t = getTranslations(language, "sidebar").sideBar;

    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

    const navItems: NavItem[] = [
        {
            title: t.dashboard,
            path: '/',
            icon: <FiHome className={styles.icon}/>,
        },
        {
            title: t.constituencies,
            path: '/constituencies',
            icon: <FaMapMarkedAlt className={styles.icon}/>,
        },
        {
            title: t.announcements,
            path: '/campaign/announcements',
            icon: <FaBullhorn  className={styles.icon}/>,
        },
        {
            title: t.events,
            path: '/campaign/events',
            icon: <FaCalendarAlt  className={styles.icon}/>,
        },
        {
            title: t.gallery,
            path: '/media/gallery',
            icon: <FaImages  className={styles.icon}/>,
        },
        {
            title: t.news,
            path: '/media/news',
            icon: <ImNewspaper   className={styles.icon}/>,
        },
        {
            title: t.donate,
            path: '/donate',
            icon: <FaHandHoldingHeart className={styles.icon}/>,
        },
        {
            title: t.settings,
            path: '/settings',
            icon: <FaCogs className={styles.icon}/>,
        }
    ];

    const toggleExpand = (title: string) => {
        setExpandedItems((prev) => ({...prev, [title]: !prev[title]}));
    };

    const isActive = (path: string) => {
        return router.pathname === path || router.pathname.startsWith(`${path}/`);
    };

    const handleItemClick = (path: string) => {
        void router.replace(path);
        if (isMobile) onClose();
    };

    const renderNavItem = (item: NavItem, depth = 0) => {
        const hasChildren = item.items && item.items.length > 0;
        const isExpanded = expandedItems[item.title];

        return (
            <div key={item.path} className={styles.navItemContainer}>
                <div
                    className={`${styles.navItem} ${isActive(item.path) ? styles.active : ''}`}
                    style={{paddingLeft: `${1 + depth}rem`}}
                    onClick={() => hasChildren ? toggleExpand(item.title) : handleItemClick(item.path)}
                >
                    <span className={styles.iconWrapper}>{item.icon}</span>
                    <span className={styles.navText}>{item.title}</span>
                    {hasChildren && (
                        <span className={styles.chevron}>
              {isExpanded ? <FiChevronDown/> : <FiChevronRight/>}
            </span>
                    )}
                </div>

                {hasChildren && isExpanded && (
                    <div className={styles.subItems}>
                        {item.items?.map(subItem => renderNavItem(subItem, depth + 1))}
                    </div>
                )}
            </div>
        );
    };

    function handleToggle() {
        onClose();
    }

    return (
        <nav className={styles.navigationContainer}>
            <div className={`${styles.sideNav} ${isOpen ? styles.open : styles.closed}`}>
                {isMobile && (
                    <div className={styles.mobileHeader}>
                        <div className={styles.logoContainer}>
                            <Link href="/" passHref>
                                <span className={styles.logo}>Xaqsoor</span>
                            </Link>
                        </div>
                        <button
                            className={styles.closeButton}
                            onClick={onClose}
                            aria-label="Close menu"
                        >
                            <FiX size={24}/>
                        </button>
                    </div>
                )}
                <div className={styles.navItems}>
                    {navItems.map(item => renderNavItem(item))}
                </div>
                {/* For non-mobile devices the toggleButton is rendered within the sidebar */}
                {!isMobile && isOpen && (
                    <div
                        className={`${styles.toggleButton} ${isOpen ? styles.openButton : ''}`}
                        aria-label="Toggle sidebar"
                        onClick={handleToggle}
                    >
                        <AiOutlineDoubleLeft/>
                    </div>
                )}
            </div>
            {/* When sidebar is closed, the toggleButton is rendered separately */}
            {!isMobile && !isOpen && (
                <div
                    className={`${styles.toggleButton} ${!isOpen ? styles.closedButton : ''}`}
                    aria-label="Toggle sidebar"
                    onClick={handleToggle}
                >
                    <AiOutlineDoubleRight/>
                </div>
            )}
        </nav>
    );
};

export default Sidebar;

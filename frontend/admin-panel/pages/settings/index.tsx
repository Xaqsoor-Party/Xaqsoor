import styles from '@/styles/Settings.module.css';
import Link from 'next/link';
import {FaUser, FaEdit, FaKey, FaShieldAlt, FaLaptop} from 'react-icons/fa';
import {useLanguage} from "@/context/LanguageContext";
import {getTranslations} from "@/translations";
import Head from "next/head";

const SettingsPage = () => {
    const {language} = useLanguage();
    const t = getTranslations(language, "settingsPage").settings;
    const settingOptions = [
        {
            title: t.options.profile.title,
            description: t.options.profile.description,
            icon: <FaUser/>,
            href: '/settings/profile',
        },
        {
            title: t.options.editProfile.title,
            description: t.options.editProfile.description,
            icon: <FaEdit/>,
            href: '/settings/edit-profile',
        },
        {
            title: t.options.changePassword.title,
            description: t.options.changePassword.description,
            icon: <FaKey/>,
            href: '/settings/change-password',
        },
        {
            title: t.options.mfa.title,
            description: t.options.mfa.description,
            icon: <FaShieldAlt/>,
            href: '/settings/mfa',
        },
        {
            title: t.options.activeSessions.title,
            description: t.options.activeSessions.description,
            icon: <FaLaptop/>,
            href: '/settings/sessions',
        },
    ];

    return (
        <>
            <Head>
                <title>{t.settingsTitle} • Xaqsoor</title>
            </Head>
            <div className={styles.container}>
                <h1 className={styles.title}>{t.settingsTitle}</h1>
                <div className={styles.cardGrid}>
                    {settingOptions.map((option) => (
                        <Link href={option.href} key={option.href} className={styles.card}>
                            <div className={styles.icon}>{option.icon}</div>
                            <div>
                                <h2>{option.title}</h2>
                                <p>{option.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
};

export default SettingsPage;

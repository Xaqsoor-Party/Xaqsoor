import React, {useState} from 'react';
import Head from 'next/head';
import styles from '@/styles/ProfilePage.module.css';
import ProfileImage from "@/components/settings/ProfileImage/ProfileImage";
import {useAuthentication} from "@/auth/AuthProvider";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import UserDataDisplay from "@/components/settings/UserDataDisplay/UserDataDisplay";
import ContactInfo from "@/components/settings/ContactInfo/ContactInfo";
import WorkExperienceDisplay from "@/components/settings/WorkExperienceDisplay/WorkExperienceDisplay";
import AcademicRecordDisplay from "@/components/settings/AcademicRecordDisplay/AcademicRecordDisplay";
import {useLanguage} from "@/context/LanguageContext";
import {getTranslations} from "@/translations";

const ProfilePage: React.FC = () => {
    const {user} = useAuthentication();
    const [activeTab, setActiveTab] = useState<string>('about');
    const {language} = useLanguage();
    const t = getTranslations(language, 'settingsPage').profile;

    if (!user) {
        return <div className={styles.loading}>Loading user profile...</div>;
    }
    const breadcrumbData = [
        {label: 'Home', link: '/'},
        {label: 'Settings', link: '/settings'},
        {label: 'profile', link: '/settings/profile'},
    ];

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
    };

    const tabMap = {
        about: <UserDataDisplay/>,
        work: <WorkExperienceDisplay/>,
        education: <AcademicRecordDisplay/>,
        contact: <ContactInfo/>
    };

    return (
        <>
            <Head>
                <title>Profile</title>
                <meta name="description" content={`Profile page for ${user.firstName} ${user.lastName}`}/>
            </Head>
            <div className={styles.container}>
                <div className={styles.profileContainer}>
                    <Breadcrumb breadcrumbs={breadcrumbData}/>
                    <div className={styles.backgroundBox}>
                        <div className={styles.initialsCircle}>
                            <ProfileImage/>
                        </div>
                    </div>

                    <div className={styles.userDetails}>
                        <h2 className={styles.fullName}>
                            {user.firstName} {user.middleName} {user.lastName}
                        </h2>
                    </div>

                    <nav className={styles.navigationTabs}>
                        {['about', 'work', 'education', 'contact'].map((tab) => (
                            <span
                                key={tab}
                                className={`${styles.navTab} ${activeTab === tab ? styles.activeTab : ''}`}
                                onClick={() => handleTabClick(tab)}
                            >
                                 {t.tabs[tab as keyof typeof t.tabs]}
                        </span>
                        ))}
                    </nav>


                </div>

                <div className={styles.tabContent}>
                    {tabMap[activeTab as keyof typeof tabMap]}
                </div>
            </div>

        </>
    );
};

export default ProfilePage;
import React from "react";
import { FaLeaf, FaUsers, FaHandshake, FaChartLine, FaComments, FaUserShield } from 'react-icons/fa';

import JoinForm from "@/components/forms/JoinForm/JoinForm";
import styles from "@/styles/JoinPage.module.css";
import {useLanguage} from "@/context/LanguageContext";
import {getTranslations} from "@/translations";

const iconMap = {
    FaLeaf: <FaLeaf className={styles.icon}/>,
    FaUsers: <FaUsers className={styles.icon}/>,
    FaHandshake: <FaHandshake className={styles.icon}/>,
    FaChartLine: <FaChartLine className={styles.icon}/>,
    FaComments: <FaComments className={styles.icon}/>,
    FaUserShield: <FaUserShield className={styles.icon}/>
};

const PartyJoinPage: React.FC = () => {
    const {language} = useLanguage();
    const translations = getTranslations(language, "joinPage").partyJoinPage;
    return (
        <div className={styles.container}>
            {/* Top Title and Intro */}
            <div className={styles.header}>
                <div className={styles.headerIconTitle}>
                    <h1 className={styles.headerTitle}>{translations.header.title}</h1>
                </div>
                <p className={styles.headerText}>
                    {translations.header.description}
                </p>
            </div>

            {/* Main Section: Form Left - Info Right */}
            <div className={styles.mainContent}>
                {/* Left: Form */}
                <div className={styles.formSection}>
                    <h2 className={styles.sectionTitle}> {translations.mainContent.formSection.title}</h2>
                    <JoinForm />
                </div>

                {/* Right: Info */}
                <div className={styles.infoSection}>
                    <h2 className={styles.sectionTitle}>{translations.mainContent.infoSection.title}</h2>
                    <ul className={styles.bulletList}>
                        {translations.mainContent.infoSection.bulletPoints.map((point, index) => {
                            // @ts-ignore
                            const IconComponent = iconMap[point.icon];
                            return (
                                <li key={index} className={styles.bulletItem}>
                                    {IconComponent}

                                    <div className={styles.bulletText}>
                                        <strong>{point.title}</strong><br />
                                        {point.description}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>

            </div>

            <div className={styles.footerText}>
                <h2 className={styles.sectionTitle}>{translations.footer.title}</h2>
                <p className={styles.footerDescription}>
                    {translations.footer.description}
                </p>
                <ul className={styles.visionList}>
                    {translations.footer.visionList.map((vision, index) => (
                        <li key={index} className={styles.visionItem}>{vision}</li>
                    ))}
                </ul>
                <p className={styles.footerDescription}>
                    {translations.footer.callToAction}
                </p>
            </div>
        </div>
    );
};

export default PartyJoinPage;
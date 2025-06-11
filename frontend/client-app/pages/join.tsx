import React from "react";
import {FaChartLine, FaComments, FaHandshake, FaLeaf, FaUsers, FaUserShield} from 'react-icons/fa';

import JoinForm from "@/components/forms/JoinForm/JoinForm";
import styles from "@/styles/JoinPage.module.css";
import {useLanguage} from "@/context/LanguageContext";
import {getTranslations} from "@/translations";
import {Layout} from "@/components/Layout_1";

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
        <Layout>
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
                        <JoinForm/>
                    </div>

                    {/* Right: Info */}
                    <div className={styles.infoSection}>
                        <h2 className={styles.sectionTitle}>{translations.mainContent.infoSection.title}</h2>
                        <ul className={styles.bulletList}>
                            {translations.mainContent.infoSection.bulletPoints.map((point, index) => {
                                // @ts-expect-error TS7053: Dynamic field assignment causes index signature error
                                const IconComponent = iconMap[point.icon];
                                return (
                                    <li key={index} className={styles.bulletItem}>
                                        {IconComponent}

                                        <div className={styles.bulletText}>
                                            <strong>{point.title}</strong><br/>
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
        </Layout>
    );
};

export default PartyJoinPage;
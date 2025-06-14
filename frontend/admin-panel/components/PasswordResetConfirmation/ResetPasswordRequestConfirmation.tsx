import Head from "next/head";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import {useLanguage} from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/common/LanguageSwitcher/LanguageSwitcher";
import {getTranslations} from "@/translations";
import styles from "./ResetPasswordRequestConfirmation.module.css"

interface PasswordResetConfirmationProps {
    email: string;
}

const ResetPasswordRequestConfirmation: React.FC<PasswordResetConfirmationProps> = ({email}) => {
    const {language} = useLanguage();
    const translation = getTranslations(language, 'authPages').PasswordResetConfirmation;
    return (
        <>
            <Head>
                <title>Password Reset Confirmation • Xaqsoor</title>
            </Head>
            <div className={styles.container}>
                <div className={styles.logoContainer}>
                    <Link href="/" className={styles.logo}>
                        <Image src={"/images/Xaqsoor_Logo_English_1.png"} alt={"logo"} width={200} height={40}/>

                    </Link>
                </div>
                <div className={styles.confirmationContainer}>
                    <div className={styles.languageSwitcherContainer}>
                        <LanguageSwitcher/>
                    </div>
                    <h2 className={styles.confirmationTitle}>{translation.title}</h2>
                    <p className={styles.confirmationMessage}>
                        {translation.message(email)}
                    </p>
                    <Link href={"/auth/login"} className={styles.backLink}>{translation.backLinkText}</Link>
                </div>
            </div>
        </>

    )
}
export default ResetPasswordRequestConfirmation;
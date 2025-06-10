import Head from "next/head";
import Link from "next/link";
import styles from "../styles/NotFound.module.css";
import React from "react";
import {useLanguage} from "@/context/LanguageContext";
import {getTranslations} from "@/translations";

export default function NotFoundPage() {
    const {language} = useLanguage();
    const translations = getTranslations(language, "notFoundPage").page_404;
    return (
        <>
            <Head>
                <title>404 - Page Not Found</title>
                <link rel="icon" href="/images/Replace_Me.svg"/>
                <meta name="description" content="The page you're looking for doesn't exist. Return to the homepage." />
            </Head>
            <div className={styles.container}>
                <h1 className={styles.errorCode}>{translations.errorCode}</h1>
                <p className={styles.message}>
                    {translations.message}
                </p>
                <Link href="/" className={styles.homeButton}>
                    {translations.goHome}
                </Link>
            </div>
        </>
    );
}
import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import {isValidMfaToken} from "@/util/jwt";
import Input from "@/components/common/Input/Input";
import ActionButton from "@/components/common/ActionButton/ActionButton";
import styles from "@/styles/MFAVerificationPage.module.css";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import LanguageSwitcher from "@/components/common/LanguageSwitcher/LanguageSwitcher";
import {useLanguage} from "@/context/LanguageContext";
import {getTranslations} from "@/translations";
import BubbleLoading from "@/components/common/BubbleLoading/BubbleLoading";
import useAuthApi from "@/api/hooks/useAuthApi";
import {MfaVerificationRequest} from "@/types/auth";
import {useAuthentication} from "@/auth/AuthProvider";
import {extractErrorMessage} from "@/util/extractErrorMessage";

export default function MFAVerificationPage() {
    const router = useRouter();
    const {token} = router.query;
    const [mfaCode, setMfaCode] = useState("");
    const [error, setError] = useState("");
    const [isTokenValid, setIsTokenValid] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validToken, setValidToken] = useState<string | null>(null);
    const {setAuthToken} = useAuthentication();
    const {verifyMfa} = useAuthApi();

    useEffect(() => {
        if (token && typeof token === "string") {
            if (!isValidMfaToken(token)) {
                setIsTokenValid(false);
                void router.replace("/auth/login");
            } else {
                setIsTokenValid(true);
                setValidToken(token);
            }
        } else {
            setIsTokenValid(false);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const numericValue = value.replace(/\D/g, "");
        setMfaCode(numericValue);
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validToken) {
            setIsTokenValid(false);
            void router.replace("/auth/login");
            return;
        }

        setIsSubmitting(true);

        if (!mfaCode.trim()) {
            setError("Please enter the MFA code.");
            setIsSubmitting(false);
            return;
        }

        if (mfaCode.length !== 6) {
            setError("Verification code must be 6 digits.");
            setIsSubmitting(false);
            return;
        }

        if (!isValidMfaToken(validToken)) {
            setIsTokenValid(false);
            setIsSubmitting(false);
            void router.replace("/auth/login");
            return;
        }

        const mfaData: MfaVerificationRequest = {
            mfaToken: validToken,
            verificationCode: mfaCode,
        };

        try {
            const result = await verifyMfa(mfaData);
            if (result.data?.loginStatus === "SUCCESS") {
                const {accessToken, userDTO} = result.data;
                setAuthToken(accessToken, userDTO);
            }
            await router.replace("/");
        } catch (e) {
            setError(extractErrorMessage(e, "Failed to verify MFA. Please try again."));
            setIsSubmitting(false);
        }
    };

    const {language} = useLanguage();
    const mfaTexts = getTranslations(language, "authPages").MfaTranslations;

    return (
        <>
            <Head>
                <title>Multi-Factor Authentication • Xaqsoor</title>
            </Head>
            {!isTokenValid ? (
                <div className={styles.loadingContainer}>
                    <BubbleLoading/>
                </div>
            ) : (
                <div className={styles.container}>
                    <div className={styles.logoContainer}>
                        <Link href="/" className={styles.logo}>
                            <Image src={"/images/Replace_Me.svg"} alt={"logo"} width={120} height={40}/>
                        </Link>
                    </div>

                    <div className={styles.verificationSection}>
                        <div className={styles.languageSwitcherContainer}>
                            <LanguageSwitcher/>
                        </div>
                        <h2 className={styles.title}>{mfaTexts.title}</h2>
                        <p className={styles.description}>
                            {mfaTexts.descriptionStart}{' '}
                            <a
                                href="https://support.microsoft.com/en-us/topic/what-is-multifactor-authentication-e5e39437-121c-be60-d123-eda06bddf661"
                                className={styles.mfaLink}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                (MFA)
                            </a>.
                        </p>
                        <p className={styles.instructions}>
                            {mfaTexts.instructions}
                        </p>
                        {error && <div className={styles.errorMessage}>{error}</div>}
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <Input
                                label={mfaTexts.inputLabel}
                                value={mfaCode}
                                onChange={handleChange}
                                type="text"
                                required
                                placeholder={mfaTexts.inputPlaceholder}
                                maxLength={6}
                            />
                            <ActionButton
                                type="submit"
                                disabled={isSubmitting || mfaCode.length !== 6}
                                className={styles.button}
                            >
                                {isSubmitting ? mfaTexts.verifyButton.submitting : mfaTexts.verifyButton.default}
                            </ActionButton>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
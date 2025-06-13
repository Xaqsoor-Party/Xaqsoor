import React, {useState} from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import {validateEmail} from "@/util/validator";
import Input from "@/components/common/Input/Input";
import ActionButton from "@/components/common/ActionButton/ActionButton";
import {useLanguage} from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/common/LanguageSwitcher/LanguageSwitcher";
import ResetPasswordRequestConfirmation from "@/components/PasswordResetConfirmation/ResetPasswordRequestConfirmation";
import styles from "../../styles/ResetPasswordRequest.module.css"
import useAuthApi from "@/api/hooks/useAuthApi";
import {getTranslations} from "@/translations";

export default function ResetPasswordRequest() {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [isConfirmed, setIsConfirmed] = useState(false);
    const {requestPasswordReset} = useAuthApi();
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const emailError = validateEmail(email);
        if (emailError) {
            setEmailError(emailError);
            return;
        }
        void sendResetPassword(email);
        setIsConfirmed(true);
    };

    const sendResetPassword = async (email: string) => {
        try {
            await requestPasswordReset(email);
        } catch {
        }
    };

    const {language} = useLanguage();
    const translation = getTranslations(language, 'authPages').ResetPasswordRequest;

    if (isConfirmed) {
        return <ResetPasswordRequestConfirmation email={email}/>;
    }



    return (
        <>
            <Head>
                <title>Password Reset Request • Your Company</title>
                <link rel="icon" href="/images/Replace_Me.svg"/>
            </Head>
            <div className={styles.container}>
                <div className={styles.logoContainer}>
                    <Link href="/" className={styles.logo}>
                        <Image src={"/images/Replace_Me.svg"} alt={"logo"} width={120} height={40}/>
                    </Link>
                </div>


                <div className={styles.resetContainer}>
                    <div className={styles.languageSwitcherContainer}>
                        <LanguageSwitcher/>
                    </div>
                    <h2 className={styles.title}>{translation.title}</h2>

                    <form className={styles.resetForm} onSubmit={handleSubmit}>
                        <Input
                            label={language === 'en' ? "Email" : "Email-ka"}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type={"email"}
                            required={true}
                            autoComplete={"email"}
                            errorMessage={emailError}
                        />
                        <ActionButton type="submit">{translation.buttonText}</ActionButton>
                    </form>
                    <Link href={"/auth/login"} className={styles.cancelLink}>{translation.cancelText}</Link>
                </div>
            </div>

        </>
    );
};
import React from "react";
import styles from "./AuthForm.module.css";

import Checkbox from "../common/Checkbox/Checkbox";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import ActionButton from "../common/ActionButton/ActionButton";
import BubbleLoading from "@/components/common/BubbleLoading/BubbleLoading";
import SelectInput from "@/components/common/SelectInput/SelectInput";
import AlertModal from "@/components/common/AlertModal/AlertModal";
import {useAuth} from "@/components/authForm/useAuth";
import Input from "@/components/common/Input/Input";
import LanguageSwitcher from "@/components/common/LanguageSwitcher/LanguageSwitcher";
import {useLanguage} from "@/context/LanguageContext";
import {getTranslations} from "@/translations";

interface AuthFormProps {
    isRegistering: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({isRegistering}) => {
    const {
        formData,
        errors,
        isLoading,
        showPassword,
        showModal,
        modalContent,
        handleChange,
        handleTogglePassword,
        handleSubmit,
        handleModalConfirm,
        handleModalCancel
    } = useAuth({isRegistering});

    const {language} = useLanguage();
    const translations = getTranslations(language, "authPages").AuthForms;

    const title = isRegistering ? translations.titleRegister : translations.titleLogin;
    const subtitle = isRegistering ? translations.subtitleRegister : translations.subtitleLogin;
    const register = translations.register;
    const login = translations.login;
    const signupLink = isRegistering ? translations.signupLinkRegister : translations.signupLinkLogin;
    const signupText = isRegistering ? translations.signupTextRegister : translations.signupTextLogin;

    return (
        <>
            <Head>
                <title>{isRegistering ? "Register • Xaqsoor" : "Login • Xaqsoor"}</title>
            </Head>

            <div className={styles.container}>
                <div className={styles.logoContainer}>
                    <Link href="/" className={styles.logo}>
                        <Image src="/images/Xaqsoor_Logo_English_1.png" alt="logo" width={200} height={40}/>
                    </Link>
                </div>

                <div className={styles.loginContainer}>
                    <div className={styles.languageSwitcherContainer}>
                        <LanguageSwitcher/>
                    </div>
                    <div className={styles.headerContainer}>
                        <h2 className={styles.title}>{title}</h2>
                        <p className={styles.subtitle}>
                            {subtitle}
                        </p>
                    </div>

                    <form className={styles.loginForm} onSubmit={handleSubmit}>
                        {errors.general && <div className={styles.errorMessage}>{errors.general}</div>}

                        {isRegistering && (
                            <>
                                <div className={styles.rowInputs}>
                                    <Input label={translations.firstName} name="firstName" value={formData.firstName}
                                           onChange={handleChange}
                                           required type="text" maxLength={15} errorMessage={errors.firstName}
                                           autoComplete="given-name"/>
                                    <Input label={translations.middleName} name="middleName" value={formData.middleName}
                                           onChange={handleChange}
                                           required type="text" maxLength={15} errorMessage={errors.middleName}
                                           autoComplete="additional-name"/>
                                </div>
                                <Input label={translations.lastName} name="lastName" value={formData.lastName}
                                       onChange={handleChange}
                                       required type="text" maxLength={15} errorMessage={errors.lastName}
                                       autoComplete="family-name"/>
                            </>
                        )}

                        <Input label={translations.email} name="email" value={formData.email} onChange={handleChange}
                               required
                               type={"email"} errorMessage={errors.email} autoComplete={'email'} maxLength={150}/>

                        {isRegistering && (
                            <>
                                <Input label={translations.phone} name="phone" value={formData.phone}
                                       onChange={handleChange}
                                       required
                                       type={"text"} errorMessage={errors.phone} autoComplete={'tel'}
                                       maxLength={15}
                                />
                                <SelectInput
                                    label={translations.gender}
                                    name="gender"
                                    value={formData.gender}
                                    errorMessage={errors.gender}
                                    onChange={handleChange}
                                    options={translations.genderOptions}
                                    required
                                    placeholder={translations.genderPlaceholder}
                                />
                            </>
                        )}

                        {!isRegistering && (
                            <>
                                <Input label={translations.password} name="password" value={formData.password}
                                       onChange={handleChange}
                                       type={showPassword ? "text" : "password"} required
                                       autoComplete={"current-password"}
                                       errorMessage={errors.password} maxLength={150}/>

                                <div className={styles.checkboxContainer}>
                                    <Checkbox label={translations.showPasswordText} checked={showPassword}
                                              onChange={handleTogglePassword}/>
                                    {!isRegistering &&
                                        <Link href="/auth/reset-password-request">{translations.resetPassword}</Link>}
                                </div>

                            </>
                        )}


                        <ActionButton type="submit">{isRegistering ? register : login}</ActionButton>

                        <div className={styles.signupContainer}>
                            <p>{signupText}{" "}
                                <Link href={isRegistering ? "/auth/login" : "/auth/register"}
                                      className={styles.signupLink}>
                                    {signupLink}
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>

                {isLoading && <BubbleLoading/>}
                {showModal &&
                    <AlertModal {...modalContent} onConfirm={handleModalConfirm} onClose={handleModalCancel}/>}
            </div>
        </>
    );
};

export default AuthForm;

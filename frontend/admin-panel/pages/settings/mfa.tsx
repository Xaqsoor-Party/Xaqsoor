import React, {useState} from 'react';
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";

import {useAuthentication} from "@/auth/AuthProvider";
import useMfaApi from "@/api/hooks/useMfaApi";

import {MfaSetupDetails} from "@/types/auth";
import ActionButton from "@/components/common/ActionButton/ActionButton";
import Input from "@/components/common/Input/Input";
import styles from '@/styles/MfaSetupPage.module.css';
import Image from "next/image";
import {extractErrorMessage} from "@/util/extractErrorMessage";
import {useLanguage} from "@/context/LanguageContext";
import {getTranslations} from "@/translations";

const MfaSetupPage: React.FC = () => {
    const {user, setUser} = useAuthentication();
    const {setupMfa, disableMfa, verifyInitialMfa} = useMfaApi();

    const [mfaSetupDetails, setMfaSetupDetails] = useState<MfaSetupDetails | null>(null);
    const [verificationCode, setVerificationCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const {language} = useLanguage();
    const t = getTranslations(language, "settingsPage").mfa;

    const breadcrumbData = [
        {label: 'Home', link: '/'},
        {label: 'Settings', link: '/settings'},
        {label: 'MFA', link: '/settings/mfa'},
    ];

    const handleEnableMfa = async () => {
        if (!user) return;

        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await setupMfa(user.userId);
            if (response && response.data) {
                setMfaSetupDetails(response.data.mfaSetupDetails);
                setSuccess(t.mfaInitiated);
            } else {
                setError(t.errorMessages.unexpectedResponse);
            }
        } catch (err) {
            setError(extractErrorMessage(err, t.errorMessages.setup));
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !mfaSetupDetails) return;

        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await verifyInitialMfa(user.userId, {
                mfaSecret: mfaSetupDetails.mfaSecret,
                verificationCode
            });

            // Update user state
            setUser({
                ...user,
                mfaEnabled: true,
                mfaQrCodeImageUrl: mfaSetupDetails.qrCodeImageUri
            });

            setSuccess(t.successMessages.enabled);
            setMfaSetupDetails(null);
            setVerificationCode('');
        } catch (err) {
            setError(extractErrorMessage(err, t.errorMessages.verify));
        } finally {
            setIsLoading(false);
        }
    };

    const handleDisableMfa = async () => {
        if (!user) return;

        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await disableMfa(user.userId);

            // Update user state
            setUser({
                ...user,
                mfaEnabled: false,
                mfaQrCodeImageUrl: undefined
            });

            setSuccess(t.successMessages.disabled);
        } catch (err) {
            setError(extractErrorMessage(err, t.errorMessages.disable));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Breadcrumb breadcrumbs={breadcrumbData}/>
            <div className={styles.container}>
                <h1 className={styles.header}>{t.title}</h1>

                <div className={styles.card}>
                    <div className={styles.statusIndicator}>
                        <div className={`${styles.statusDot} ${user?.mfaEnabled ? styles.active : ''}`}/>
                        <span> {t.status.label}
                            <strong>{user?.mfaEnabled ? t.status.enabled : t.status.disabled}</strong></span>
                    </div>

                    {user?.mfaEnabled ? (
                        <div className={styles.enabledState}>
                            <p className={styles.description}>{t.description.enabled}</p>

                            {user.mfaQrCodeImageUrl && (
                                <div className={styles.qrSection}>
                                    <h3>{t.setup.qrCodeHeading}</h3>
                                    <Image
                                        src={user.mfaQrCodeImageUrl}
                                        alt="MFA QR Code"
                                        className={styles.qrImage}
                                        width={180}
                                        height={180}
                                    />
                                    <p className={styles.note}>
                                        {t.setup.reconfigureNote}
                                    </p>
                                </div>
                            )}

                            <div className={styles.actions}>
                                <ActionButton
                                    onClick={handleDisableMfa}
                                    disabled={isLoading}
                                    className={styles.disableButton}
                                >
                                    {isLoading ? t.buttons.processing : t.buttons.disableMfa}
                                </ActionButton>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.disabledState}>
                            <p className={styles.description}>{t.description.disabled}</p>
                            {mfaSetupDetails ? (
                                <div className={styles.setupForm}>
                                    <h3>{t.setup.title}</h3>

                                    <div className={styles.qrSection}>
                                        <Image
                                            src={mfaSetupDetails.qrCodeImageUri}
                                            alt="MFA Setup QR Code"
                                            className={styles.qrImage}
                                            width={180}
                                            height={180}
                                        />
                                        <p className={styles.note}>
                                            <p className={styles.note}>{t.setup.qrNote}</p>
                                        </p>
                                    </div>

                                    <div className={styles.secretSection}>
                                        <p className={styles.secretLabel}>{t.setup.secretLabel}:</p>
                                        <div className={styles.secretCode}>
                                            {mfaSetupDetails.mfaSecret}
                                        </div>
                                    </div>

                                    <form onSubmit={handleVerifyCode} className={styles.verificationForm}>
                                        <Input
                                            label={t.setup.label}
                                            value={verificationCode}
                                            onChange={(e) => setVerificationCode(e.target.value)}
                                            type="text"
                                            required
                                            autoComplete="off"
                                            placeholder={t.setup.placeholder}
                                            maxLength={6}
                                            disabled={isLoading}
                                        />

                                        <div className={styles.actions}>
                                            <ActionButton
                                                type="submit"
                                                disabled={isLoading || verificationCode.length < 6}
                                            >
                                                {isLoading ? t.buttons.verifying : t.buttons.enableMfa}
                                            </ActionButton>

                                            <ActionButton
                                                onClick={() => {
                                                    setMfaSetupDetails(null);
                                                    setSuccess(null);
                                                }}
                                                disabled={isLoading}
                                                className={styles.cancelButton}
                                            >
                                                {t.buttons.cancel}
                                            </ActionButton>
                                        </div>
                                    </form>
                                </div>
                            ) : (
                                <div className={styles.actions}>
                                    <ActionButton
                                        onClick={handleEnableMfa}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? t.buttons.preparing : t.buttons.enableMfa}
                                    </ActionButton>
                                </div>
                            )}
                        </div>
                    )}

                    {(error || success) && (
                        <div className={`${styles.message} ${error ? styles.error : styles.success}`}>
                            {error || success}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default MfaSetupPage;
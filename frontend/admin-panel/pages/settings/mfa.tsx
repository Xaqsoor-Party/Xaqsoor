import React, {useEffect, useState} from 'react';
import useMfaApi from '@/api/hooks/useMfaApi';
import {useAuthentication} from '@/auth/AuthProvider';
import SpinLoading from '@/components/common/SpinLoading/SpinLoading';
import ActionButton from '@/components/common/ActionButton/ActionButton';
import {FiCheckCircle, FiInfo, FiXCircle} from 'react-icons/fi';
import Image from 'next/image';
import {MdQrCode} from 'react-icons/md';
import styles from '@/styles/MfaSetupPage.module.css';
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import {useLanguage} from "@/context/LanguageContext";
import {getTranslations} from "@/translations";
import {extractErrorMessage} from "@/util/extractErrorMessage";

const MfaSetupPage: React.FC = () => {
    const {user, setUser} = useAuthentication();
    const {setupMfa, disableMfa} = useMfaApi();
    const {language} = useLanguage();
    const t = getTranslations(language, "settingsPage").mfa;

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [qrCodeImageUri, setQrCodeImageUri] = useState<string | null>(null);
    const isMfaEnabled = user?.mfaEnabled || false;

    useEffect(() => {
        if (user?.mfaQrCodeImageUrl) {
            setQrCodeImageUri(user.mfaQrCodeImageUrl);
        }
    }, [user?.mfaQrCodeImageUrl]);

    const handleSetupMfa = async () => {
        if (!user?.userId) {
            setError(t.messages.userNotFound);
            return;
        }

        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const response = await setupMfa(user.userId);
            if (response.data?.mfaQRCodeImageUri) {
                setQrCodeImageUri(response.data.mfaQRCodeImageUri);
                setSuccessMessage(t.messages.setupSuccess);
                setUser({
                    ...user,
                    mfaQrCodeImageUrl: response.data.mfaQRCodeImageUri,
                    mfaEnabled: true
                });
            } else {
                setError(t.messages.setupError);
            }
        } catch (err) {
            setError(extractErrorMessage(err, t.messages.setupError));
        } finally {
            setIsLoading(false);
        }
    };

    const handleDisableMfa = async () => {
        if (!user?.userId) {
            setError(t.messages.userNotFound);
            return;
        }

        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            await disableMfa(user.userId);
            setSuccessMessage(t.messages.disableSuccess);
            setUser({
                ...user,
                mfaQrCodeImageUrl: "",
                mfaEnabled: false
            });
            setQrCodeImageUri(null);
        } catch (err) {
            setError(extractErrorMessage(err, t.messages.disableError));
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) {
        return (
            <div className={styles.loadingContainer}>
                <SpinLoading size={50}/>
                <p>Loading user data...</p>
            </div>
        );
    }
    const breadcrumbData = [
        {label: 'Home', link: '/'},
        {label: 'Settings', link: '/settings'},
        {label: 'MFA', link: '/settings/mfa'},
    ];

    return (
        <>
            <Breadcrumb breadcrumbs={breadcrumbData}/>

            <div className={styles.container}>
                <h1 className={styles.pageTitle}>{t.title}</h1>

                <div className={styles.statusCard}>
                    <div className={isMfaEnabled ? styles.statusEnabled : styles.statusDisabled}>
                        {isMfaEnabled ? (
                            <>
                                <FiCheckCircle className={styles.statusIcon}/>
                                <div>
                                    <p className={styles.statusText}>{t.status.enabled.title}</p>
                                    <p className={styles.statusDescription}>
                                        {t.status.enabled.description}
                                    </p>
                                </div>
                            </>
                        ) : (
                            <>
                                <FiXCircle className={styles.statusIcon}/>
                                <div>
                                    <p className={styles.statusText}>{t.status.disabled.title}</p>
                                    <p className={styles.statusDescription}>
                                        {t.status.disabled.description}
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {(error || successMessage) && (
                    <div className={`${styles.messageBox} ${error ? styles.error : styles.success}`}>
                        {error ? <FiInfo/> : <FiCheckCircle/>}
                        <p>{error || successMessage}</p>
                    </div>
                )}

                <div className={styles.qrSection}>
                    {qrCodeImageUri ? (
                        <div className={styles.qrCodeContainer}>
                            <div className={styles.qrHeader}>
                                <MdQrCode className={styles.qrIcon}/>
                                <p className={styles.instruction}>
                                    {t.qr.instruction}
                                </p>
                            </div>

                            <div className={styles.qrImageWrapper}>
                                <Image
                                    src={qrCodeImageUri}
                                    alt={t.qr.alt}
                                    width={200}
                                    height={200}
                                    className={styles.qrImage}
                                />
                            </div>

                            <div className={styles.actionRow}>
                                <ActionButton
                                    onClick={() => setQrCodeImageUri(null)}
                                    disabled={isLoading}
                                    className={styles.hideQrButton}
                                >
                                    {t.qr.hideButton}
                                </ActionButton>

                                {isMfaEnabled && (
                                    <ActionButton
                                        onClick={handleDisableMfa}
                                        disabled={isLoading}
                                        className={styles.disableButton}
                                    >
                                        {t.actions.disable}
                                    </ActionButton>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className={styles.actionContainer}>
                            {isMfaEnabled ? (
                                <ActionButton
                                    onClick={() => setQrCodeImageUri(user.mfaQrCodeImageUrl || null)}
                                    className={styles.showQrButton}
                                >
                                    {t.qr.showButton}
                                </ActionButton>
                            ) : (
                                <ActionButton
                                    onClick={handleSetupMfa}
                                    disabled={isLoading}
                                    className={styles.enableButton}
                                >
                                    {t.actions.enable}
                                </ActionButton>
                            )}

                            {isMfaEnabled && (
                                <ActionButton
                                    onClick={handleDisableMfa}
                                    disabled={isLoading}
                                    className={styles.disableButton}
                                >
                                    {t.actions.disable}
                                </ActionButton>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default MfaSetupPage;
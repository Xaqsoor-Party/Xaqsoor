import React, { useState, useEffect } from 'react';
import useMfaApi from '@/api/hooks/useMfaApi';
import { useAuthentication } from '@/auth/AuthProvider';
import SpinLoading from '@/components/common/SpinLoading/SpinLoading';
import ActionButton from '@/components/common/ActionButton/ActionButton';
import { FiCheckCircle, FiXCircle, FiInfo } from 'react-icons/fi';
import Image from 'next/image';
import { MdQrCode } from 'react-icons/md';
import styles from '@/styles/MfaSetupPage.module.css';
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";

const MfaSetupPage: React.FC = () => {
    const { user, setUser } = useAuthentication();
    const { setupMfa, disableMfa } = useMfaApi();

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
            setError('User ID not found. Please log in.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const response = await setupMfa(user.userId);
            if (response.data?.mfaQRCodeImageUri) {
                setQrCodeImageUri(response.data.mfaQRCodeImageUri);
                setSuccessMessage('MFA setup initiated. Scan the QR code with your authenticator app.');
                setUser({
                    ...user,
                    mfaQrCodeImageUrl: response.data.mfaQRCodeImageUri,
                    mfaEnabled: true
                });
            } else {
                setError('Failed to generate MFA QR code. Please try again.');
            }
        } catch (err) {
            const error = err as Error;
            setError(`Failed to initiate MFA setup. ${error.message || 'Please try again.'}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDisableMfa = async () => {
        if (!user?.userId) {
            setError('User ID not found. Please log in.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            await disableMfa(user.userId);
            setSuccessMessage('MFA disabled successfully.');
            setUser({
                ...user,
                mfaQrCodeImageUrl: "",
                mfaEnabled: false
            });
            setQrCodeImageUri(null);
        } catch (err) {
            const error = err as Error;
            setError(`Failed to disable MFA. ${error.message || 'Please try again.'}`);
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) {
        return (
            <div className={styles.loadingContainer}>
                <SpinLoading size={50} />
                <p>Loading user data...</p>
            </div>
        );
    }
    const breadcrumbData = [
        { label: 'Home', link: '/' },
        { label: 'Settings', link: '/settings' },
        { label: 'MFA', link: '/settings/mfa' },
    ];

    return (
        <>
            <Breadcrumb breadcrumbs={breadcrumbData} />

            <div className={styles.container}>
                <h1 className={styles.pageTitle}>Multi-Factor Authentication (MFA)</h1>

                <div className={styles.statusCard}>
                    <div className={isMfaEnabled ? styles.statusEnabled : styles.statusDisabled}>
                        {isMfaEnabled ? (
                            <>
                                <FiCheckCircle className={styles.statusIcon} />
                                <div>
                                    <p className={styles.statusText}>MFA is currently <strong>Enabled</strong></p>
                                    <p className={styles.statusDescription}>
                                        Your account is secured with an extra layer of protection
                                    </p>
                                </div>
                            </>
                        ) : (
                            <>
                                <FiXCircle className={styles.statusIcon} />
                                <div>
                                    <p className={styles.statusText}>MFA is currently <strong>Disabled</strong></p>
                                    <p className={styles.statusDescription}>
                                        For enhanced security, we recommend enabling MFA
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {(error || successMessage) && (
                    <div className={`${styles.messageBox} ${error ? styles.error : styles.success}`}>
                        {error ? <FiInfo /> : <FiCheckCircle />}
                        <p>{error || successMessage}</p>
                    </div>
                )}

                <div className={styles.qrSection}>
                    {qrCodeImageUri ? (
                        <div className={styles.qrCodeContainer}>
                            <div className={styles.qrHeader}>
                                <MdQrCode className={styles.qrIcon} />
                                <p className={styles.instruction}>
                                    Scan this QR code with your authenticator app (e.g., Google Authenticator, Authy, Microsoft Authenticator)
                                </p>
                            </div>

                            <div className={styles.qrImageWrapper}>
                                <Image
                                    src={qrCodeImageUri}
                                    alt="MFA QR Code"
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
                                    Hide QR Code
                                </ActionButton>

                                {isMfaEnabled && (
                                    <ActionButton
                                        onClick={handleDisableMfa}
                                        disabled={isLoading}
                                        className={styles.disableButton}
                                    >
                                        Disable MFA
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
                                    Show QR Code
                                </ActionButton>
                            ) : (
                                <ActionButton
                                    onClick={handleSetupMfa}
                                    disabled={isLoading}
                                    className={styles.enableButton}
                                >
                                    Enable MFA
                                </ActionButton>
                            )}

                            {isMfaEnabled && (
                                <ActionButton
                                    onClick={handleDisableMfa}
                                    disabled={isLoading}
                                    className={styles.disableButton}
                                >
                                    Disable MFA
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
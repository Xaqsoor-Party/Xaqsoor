import React, {useEffect, useState} from 'react';
import useSessionsApi from '@/api/hooks/useSessionsApi';
import {useAuthentication} from '@/auth/AuthProvider';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import SpinLoading from '@/components/common/SpinLoading/SpinLoading';
import ActionButton from '@/components/common/ActionButton/ActionButton';
import {SessionDto} from '@/types/sessions';
import styles from '@/styles/Sessions.module.css';
import {FiCheckCircle, FiClock, FiInfo, FiMapPin, FiMonitor, FiXCircle} from 'react-icons/fi';
import AlertModal from "@/components/common/AlertModal/AlertModal";
import {useLanguage} from "@/context/LanguageContext";
import {getTranslations} from "@/translations";
import {extractErrorMessage} from "@/util/extractErrorMessage";

const Sessions: React.FC = () => {
    const {user} = useAuthentication();
    const {getActiveSessions, revokeOtherSessions} = useSessionsApi();
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [sessions, setSessions] = useState<SessionDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const {language} = useLanguage();
    const t = getTranslations(language, "settingsPage").sessions;
    const breadcrumbData = [
        {label: 'Home', link: '/'},
        {label: 'Settings', link: '/settings'},
        {label: 'Active Sessions', link: '/settings/sessions'},
    ];

    const fetchSessions = async () => {
        if (!user?.id) {
            setError(t.errors.userNotFound);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const response = await getActiveSessions(user.id);
            if (response.data?.activeSessions) {
                setSessions(response.data.activeSessions);
            } else {
                setSessions([]);
                setError(t.errors.noSessions);
            }
        } catch (err) {
            setError(extractErrorMessage(err, t.errors.fetchFailed));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        void fetchSessions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id]);

    const handleRevokeOtherSessions = () => {
        setShowConfirmModal(true);
    };

    const confirmRevokeSessions = async () => {
        if (!user?.id) {
            setError(t.errors.userNotFound);
            return;
        }

        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);
        setShowConfirmModal(false);
        try {
            const response = await revokeOtherSessions(user.id);
            if (response.data?.revokedSessionsCount !== undefined) {
                setSuccessMessage(t.successMessages.revokeSuccess(response.data.revokedSessionsCount));
                // Re-fetch sessions to update the list after revocation
                await fetchSessions();
            } else {
                setError(t.errors.fetchFailed);
            }
        } catch (err) {
            setError(extractErrorMessage(err, t.errors.revokeFailed));
        } finally {
            setIsLoading(false);
        }
    };

    const formatLastAccessed = (isoString: string) => {
        try {
            const date = new Date(isoString);
            return new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
                timeZoneName: 'short'
            }).format(date);
        } catch (e) {
            console.log("Error formatting date:", isoString, e);
            return isoString;
        }
    };


    if (!user) {
        return (
            <div className={styles.loadingContainer}>
                <SpinLoading size={50}/>
                <p>{t.loading.sessionsLoading}</p>
            </div>
        );
    }

    return (
        <div className={styles.sessionsPage}>
            <Breadcrumb breadcrumbs={breadcrumbData}/>
            <h1 className={styles.pageTitle}>{t.title}</h1>

            <div className={styles.contentCard}>
                <p className={styles.infoText}>
                    {t.infoText}
                </p>

                {error && (
                    <div className={`${styles.messageBox} ${styles.error}`}>
                        <FiXCircle/>
                        <p>{error}</p>
                    </div>
                )}
                {successMessage && (
                    <div className={`${styles.messageBox} ${styles.success}`}>
                        <FiCheckCircle/>
                        <p>{successMessage}</p>
                    </div>
                )}

                {isLoading ? (
                    <div className={styles.loadingContainer}>
                        <SpinLoading size={50}/>
                        <p>{t.loading.sessionsLoading}</p>
                    </div>
                ) : sessions.length === 0 ? (
                    <div className={styles.noSessions}>
                        <FiInfo size={40} className={styles.noSessionsIcon}/>
                        <p>{t.errors.noSessions}</p>
                    </div>
                ) : (
                    <>
                        <div className={styles.sessionList}>
                            {sessions.map((session) => (
                                <div key={session.id} className={styles.sessionCard}>
                                    <div className={styles.sessionIconContainer}>
                                        <FiMonitor className={styles.sessionIcon}/>
                                    </div>
                                    <div className={styles.sessionDetails}>
                                        <h3 className={styles.userAgent}>{session.deviceInfo || t.sessions.unknownDevice}</h3>
                                        <div className={styles.detailItem}>
                                            <FiMapPin className={styles.detailIcon}/>
                                            <span>{session.ipAddress || t.sessions.unknownIp}</span>
                                        </div>
                                        <div className={styles.detailItem}>
                                            <FiClock className={styles.detailIcon}/>
                                            <span>{t.sessions.lastActiveLabel}: {formatLastAccessed(session.loginTimestamp)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <ActionButton
                            onClick={handleRevokeOtherSessions}
                            disabled={isLoading || sessions.length <= 1}
                            className={styles.revokeButton}
                        >
                            {isLoading ? <SpinLoading size={20}/> : t.sessions.revokeButton}
                        </ActionButton>
                        {sessions.length <= 1 && (
                            <p className={styles.hintText}>{t.sessions.revokeButtonHint}</p>
                        )}
                    </>
                )}
            </div>
            {showConfirmModal && (
                <AlertModal
                    title={t.sessions.confirmModal.title}
                    message={t.sessions.confirmModal.message}
                    onConfirm={confirmRevokeSessions}
                    onClose={() => setShowConfirmModal(false)}
                    error={false}
                    buttonText={t.sessions.confirmModal.confirmButtonText}
                />
            )}
        </div>
    );
};

export default Sessions;
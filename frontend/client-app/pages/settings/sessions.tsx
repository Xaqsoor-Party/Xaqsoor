import React, { useState, useEffect } from 'react';
import useSessionsApi from '@/api/hooks/useSessionsApi';
import { useAuthentication } from '@/auth/AuthProvider';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import SpinLoading from '@/components/common/SpinLoading/SpinLoading';
import ActionButton from '@/components/common/ActionButton/ActionButton';
import { SessionDto } from '@/types/sessions';
import styles from '@/styles/Sessions.module.css';
import {FiMonitor, FiClock, FiMapPin, FiXCircle, FiCheckCircle, FiInfo} from 'react-icons/fi';
import AlertModal from "@/components/common/AlertModal/AlertModal";

const Sessions: React.FC = () => {
    const { user } = useAuthentication();
    const { getActiveSessions, revokeOtherSessions } = useSessionsApi();
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [sessions, setSessions] = useState<SessionDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const breadcrumbData = [
        { label: 'Home', link: '/' },
        { label: 'Settings', link: '/settings' },
        { label: 'Active Sessions', link: '/settings/sessions' },
    ];

    const fetchSessions = async () => {
        if (!user?.id) {
            setError('User ID not found. Please log in.');
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
                setError('No active sessions found.');
            }
        } catch (err) {
            console.log("Failed to fetch sessions:", err);
            setError('Failed to load sessions. ' + (err as Error).message || 'Please try again later.');
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

    const confirmRevokeSessions  = async () => {
        if (!user?.id) {
            setError('User ID not found. Please log in.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);
        setShowConfirmModal(false);
        try {
            const response = await revokeOtherSessions(user.id);
            if (response.data?.revokedSessionsCount !== undefined) {
                setSuccessMessage(`Successfully revoked ${response.data.revokedSessionsCount} other session(s).`);
                // Re-fetch sessions to update the list after revocation
                await fetchSessions();
            } else {
                setError('Failed to revoke sessions.');
            }
        } catch (err) {
            console.log("Failed to revoke sessions:", err);
            setError('Failed to revoke sessions. ' + (err as Error).message || 'Please try again.');
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
            console.error("Error formatting date:", isoString, e);
            return isoString;
        }
    };


    if (!user) {
        return (
            <div className={styles.loadingContainer}>
                <SpinLoading size={50} />
                <p>Authenticating user...</p>
            </div>
        );
    }

    return (
        <div className={styles.sessionsPage}>
            <Breadcrumb breadcrumbs={breadcrumbData} />
            <h1 className={styles.pageTitle}>Active Sessions</h1>

            <div className={styles.contentCard}>
                <p className={styles.infoText}>
                    Here you can view all active login sessions for your account.
                    This includes the device, location (IP address), and when it was last active.
                    You can also revoke all other sessions except your current one for security.
                </p>

                {error && (
                    <div className={`${styles.messageBox} ${styles.error}`}>
                        <FiXCircle />
                        <p>{error}</p>
                    </div>
                )}
                {successMessage && (
                    <div className={`${styles.messageBox} ${styles.success}`}>
                        <FiCheckCircle />
                        <p>{successMessage}</p>
                    </div>
                )}

                {isLoading ? (
                    <div className={styles.loadingContainer}>
                        <SpinLoading size={50} />
                        <p>Loading sessions...</p>
                    </div>
                ) : sessions.length === 0 ? (
                    <div className={styles.noSessions}>
                        <FiInfo size={40} className={styles.noSessionsIcon} />
                        <p>No active sessions found (or only your current session is active).</p>
                    </div>
                ) : (
                    <>
                        <div className={styles.sessionList}>
                            {sessions.map((session) => (
                                <div key={session.id} className={styles.sessionCard}>
                                    <div className={styles.sessionIconContainer}>
                                        <FiMonitor className={styles.sessionIcon} />
                                    </div>
                                    <div className={styles.sessionDetails}>
                                        <h3 className={styles.userAgent}>{session.deviceInfo || 'Unknown Device'}</h3>
                                        <div className={styles.detailItem}>
                                            <FiMapPin className={styles.detailIcon} />
                                            <span>{session.ipAddress || 'Unknown IP'}</span>
                                        </div>
                                        <div className={styles.detailItem}>
                                            <FiClock className={styles.detailIcon} />
                                            <span>Last Active: {formatLastAccessed(session.loginTimestamp)}</span>
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
                            {isLoading ? <SpinLoading size={20} /> : 'Revoke All Other Sessions'}
                        </ActionButton>
                        {sessions.length <=1 && (
                            <p className={styles.hintText}>You can only revoke other sessions if more than one is active.</p>
                        )}
                    </>
                )}
            </div>
            {showConfirmModal && (
                <AlertModal
                    title="Confirm Session Revocation"
                    message="Are you sure you want to revoke all other active sessions? You will remain logged in."
                    onConfirm={confirmRevokeSessions}
                    onClose={() => setShowConfirmModal(false)}
                    error={false}
                    buttonText="Yes, Revoke"
                />
            )}
        </div>
    );
};

export default Sessions;
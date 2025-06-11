import React, { useEffect, useState } from 'react';
import useAcademicRecordApi from '@/api/hooks/useAcademicRecordApi';
import { AcademicRecordDto } from '@/types/academic';
import styles from './AcademicRecordDisplay.module.css';
import { FiBookOpen, FiCalendar, FiMapPin, FiAward } from 'react-icons/fi';
import SpinLoading from '@/components/common/SpinLoading/SpinLoading';
import {useAuthentication} from "@/auth/AuthProvider";
import {formatDuration} from "@/util/dateUtils";
import {useLanguage} from "@/context/LanguageContext";
import {getTranslations} from "@/translations";
import {extractErrorMessage} from "@/util/extractErrorMessage";

const AcademicRecordDisplay: React.FC = () => {
    const { getAcademicRecords } = useAcademicRecordApi();
    const [academicRecords, setAcademicRecords] = useState<AcademicRecordDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const {language} = useLanguage();
    const t = getTranslations(language, 'settingsPage').profile.academicRecord;
    const {user} = useAuthentication();

    useEffect(() => {
        const fetchAcademicRecords = async () => {
            if (!user?.id){
                return
            }

            try {
                setIsLoading(true);
                const response = await getAcademicRecords(user?.id);
                if (response.data && response.data.academicRecords) {
                    setAcademicRecords(response.data.academicRecords.academicRecords);
                } else {
                    setError(t.errors.noData);
                }
            } catch (err) {
                setError(extractErrorMessage(err,t.errors.failedToLoad));
            } finally {
                setIsLoading(false);
            }
        };

        void fetchAcademicRecords();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ user?.id]);

    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <SpinLoading size={50} />
                <p>{t.loadingMessage}</p>
            </div>
        );
    }

    if (error) {
        return <div className={styles.errorMessage}>{error}</div>;
    }

    if (academicRecords.length === 0) {
        return <div className={styles.noDataMessage}>{t.noDataMessage}</div>;
    }

    return (
        <div className={styles.academicRecordContainer}>
            <h2 className={styles.sectionTitle}>{t.sectionTitle}</h2>
            {academicRecords.map((record) => (
                <div key={record.id} className={styles.recordCard}>
                    <div className={styles.recordHeader}>
                        <h3 className={styles.institutionName}>{record.institutionName}</h3>
                        <span className={styles.fieldOfStudy}>{record.fieldOfStudy}</span>
                    </div>
                    <div className={styles.recordMeta}>
                        {record.degree && (
                            <div className={styles.metaItem}>
                                <FiAward className={styles.metaIcon} />
                                <span>{record.degree}</span>
                            </div>
                        )}
                        <div className={styles.metaItem}>
                            <FiBookOpen className={styles.metaIcon} />
                            <span>{record.level}</span>
                        </div>
                        <div className={styles.metaItem}>
                            <FiMapPin className={styles.metaIcon} />
                            <span>{record.location}</span>
                        </div>
                        <div className={styles.metaItem}>
                            <FiCalendar className={styles.metaIcon} />
                            <span>{formatDuration(record.startDate, record.endDate, record.currentlyStudying)}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AcademicRecordDisplay;
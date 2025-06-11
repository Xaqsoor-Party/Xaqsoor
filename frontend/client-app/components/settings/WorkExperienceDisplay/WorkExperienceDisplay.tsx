import React, {useEffect, useState} from 'react';
import useWorkExperienceApi from '@/api/hooks/useWorkExperienceApi';
import {WorkExperienceDto} from '@/types/work';
import styles from './WorkExperienceDisplay.module.css';
import {FiAlignLeft, FiCalendar, FiMapPin} from 'react-icons/fi';
import SpinLoading from '@/components/common/SpinLoading/SpinLoading';
import {useAuthentication} from "@/auth/AuthProvider";
import {formatDuration} from "@/util/dateUtils";
import {extractErrorMessage} from "@/util/extractErrorMessage";
import {useLanguage} from "@/context/LanguageContext";
import {getTranslations} from "@/translations";

const WorkExperienceDisplay: React.FC = () => {
    const {getWorkExperiences} = useWorkExperienceApi();
    const [workExperiences, setWorkExperiences] = useState<WorkExperienceDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const {language} = useLanguage();
    const t = getTranslations(language, 'settingsPage').profile.workExperience;
    const {user} = useAuthentication();

    useEffect(() => {
        const fetchWorkExperiences = async () => {
            try {
                if (!user) {
                    setError(t.errors.noUser);
                    return;
                }
                setIsLoading(true);
                const response = await getWorkExperiences(user?.id);
                if (response.data && response.data.workExperiences) {
                    setWorkExperiences(response.data.workExperiences.workExperiences);
                } else {
                    setError(t.errors.noData);
                }
            } catch (err) {
                setError(extractErrorMessage(err,t.errors.failedToLoad));
            } finally {
                setIsLoading(false);
            }
        };

        void fetchWorkExperiences();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id]);

    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <SpinLoading size={50}/>
                <p>{t.loadingMessage}</p>
            </div>
        );
    }

    if (error) {
        return <div className={styles.errorMessage}>{error}</div>;
    }

    if (workExperiences.length === 0) {
        return <div className={styles.noDataMessage}>{t.noDataMessage}</div>;
    }

    return (
        <div className={styles.workExperienceContainer}>
            <h2 className={styles.sectionTitle}>{t.sectionTitle}</h2>
            {workExperiences.map((job) => (
                <div key={job.id} className={styles.jobCard}>
                    <div className={styles.jobHeader}>
                        <h3 className={styles.jobTitle}>{job.jobTitle}</h3>
                        <span className={styles.companyName}>{job.companyName}</span>
                    </div>
                    <div className={styles.jobMeta}>
                        <div className={styles.metaItem}>
                            <FiMapPin className={styles.metaIcon}/>
                            <span>{job.location}</span>
                        </div>
                        <div className={styles.metaItem}>
                            <FiCalendar className={styles.metaIcon}/>
                            <span>{formatDuration(job.startDate, job.endDate, job.currentlyWorking)}</span>
                        </div>
                    </div>
                    <div className={styles.jobDescription}>
                        <FiAlignLeft className={styles.descriptionIcon}/>
                        <p>{job.description}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default WorkExperienceDisplay;
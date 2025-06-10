import React, {useEffect, useState} from 'react';
import useWorkExperienceApi from '@/api/hooks/useWorkExperienceApi';
import {WorkExperienceDto} from '@/types/work';
import styles from './WorkExperienceDisplay.module.css';
import {FiAlignLeft, FiCalendar, FiMapPin} from 'react-icons/fi';
import SpinLoading from '@/components/common/SpinLoading/SpinLoading';
import {useAuthentication} from "@/auth/AuthProvider";

const WorkExperienceDisplay: React.FC = () => {
    const {getWorkExperiences} = useWorkExperienceApi();
    const [workExperiences, setWorkExperiences] = useState<WorkExperienceDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const {user} = useAuthentication();

    useEffect(() => {
        const fetchWorkExperiences = async () => {
            try {
                if (!user) {
                    setError("No user found.");
                    return;
                }
                setIsLoading(true);
                const response = await getWorkExperiences(user?.id);
                if (response.data && response.data.workExperiences) {
                    setWorkExperiences(response.data.workExperiences.workExperiences);
                } else {
                    setError('No work experience data found.');
                }
            } catch (err) {
                console.log("Failed to fetch work experiences:", err);
                setError('Failed to load work experience. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        void fetchWorkExperiences();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id]);

    const formatDuration = (startDateStr: string, endDateStr: string, currentlyWorking: boolean) => {
        const parseDate = (dateString: string) => {
            const parts = dateString.split(' ');
            if (parts.length === 3) {
                const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                const monthIndex = monthNames.findIndex(name => name.toLowerCase() === parts[1].substring(0, 3).toLowerCase());

                if (monthIndex > -1) {
                    return new Date(parseInt(parts[2]), monthIndex, parseInt(parts[0]));
                }
            }
            return new Date(dateString);
        };

        const startDate = parseDate(startDateStr);
        let endDate;
        let durationText;

        if (currentlyWorking) {
            durationText = `Present`;
        } else {
            endDate = parseDate(endDateStr);
            durationText = `${endDate.getFullYear()}`;
        }

        const startMonthYear = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(startDate);

        return `${startMonthYear} - ${durationText}`;
    };

    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <SpinLoading size={50}/>
                <p>Loading work experience...</p>
            </div>
        );
    }

    if (error) {
        return <div className={styles.errorMessage}>{error}</div>;
    }

    if (workExperiences.length === 0) {
        return <div className={styles.noDataMessage}>No work experience added yet.</div>;
    }

    return (
        <div className={styles.workExperienceContainer}>
            <h2 className={styles.sectionTitle}>Work Experience</h2>
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
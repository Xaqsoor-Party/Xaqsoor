import React, { useEffect, useState } from 'react';
import useAcademicRecordApi from '@/api/hooks/useAcademicRecordApi'; // Adjust the path if needed
import { AcademicRecordDto } from '@/types/academic'; // Adjust the path if needed
import styles from './AcademicRecordDisplay.module.css'; // We'll create this CSS file
import { FiBookOpen, FiCalendar, FiMapPin, FiAward } from 'react-icons/fi';
import SpinLoading from '@/components/common/SpinLoading/SpinLoading'; // Assuming you have this component

const AcademicRecordDisplay: React.FC = () => {
    const { getAcademicRecords } = useAcademicRecordApi();
    const [academicRecords, setAcademicRecords] = useState<AcademicRecordDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Using a hardcoded user ID of 11 for demonstration
    const userId = 11;

    useEffect(() => {
        const fetchAcademicRecords = async () => {
            try {
                setIsLoading(true);
                const response = await getAcademicRecords(userId);
                if (response.data && response.data.academicRecords) {
                    setAcademicRecords(response.data.academicRecords.academicRecords);
                } else {
                    setError('No academic record data found.');
                }
            } catch (err) {
                console.error("Failed to fetch academic records:", err);
                setError('Failed to load academic records. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        void fetchAcademicRecords();
    }, [ userId]);

    const formatDuration = (startDateStr: string, endDateStr?: string, currentlyStudying?: boolean) => {
        const parseDate = (dateString: string) => {
            const parts = dateString.split(' ');
            if (parts.length === 3) {
                const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                const monthIndex = monthNames.findIndex(name => name.toLowerCase() === parts[1].substring(0, 3).toLowerCase());

                if (monthIndex > -1) {
                    return new Date(parseInt(parts[2]), monthIndex, parseInt(parts[0]));
                }
            }
            return new Date(dateString); // Fallback for other formats
        };

        const startDate = parseDate(startDateStr);
        let durationText = "";

        if (currentlyStudying) {
            durationText = `Present`;
        } else if (endDateStr) {
            const endDate = parseDate(endDateStr);
            durationText = `${endDate.getFullYear()}`;
        } else {
            durationText = "End Date N/A";
        }

        const startMonthYear = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(startDate);

        return `${startMonthYear} - ${durationText}`;
    };

    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <SpinLoading size={50} />
                <p>Loading academic records...</p>
            </div>
        );
    }

    if (error) {
        return <div className={styles.errorMessage}>{error}</div>;
    }

    if (academicRecords.length === 0) {
        return <div className={styles.noDataMessage}>No academic records added yet.</div>;
    }

    return (
        <div className={styles.academicRecordContainer}>
            <h2 className={styles.sectionTitle}>Academic Records</h2>
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
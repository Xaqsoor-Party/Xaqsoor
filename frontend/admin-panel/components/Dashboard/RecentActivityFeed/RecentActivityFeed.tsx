import React from 'react';
import styles from './RecentActivityFeed.module.css';
import {RecentActivityDto} from "@/types/dashboard";
import Link from "next/link";
import Image from "next/image";

interface RecentActivityFeedProps {
    activities: RecentActivityDto[];
    onViewAllClick?: () => void;
}

const formatTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now.getTime() - past.getTime();

    const diffMinutes = Math.round(diffMs / (1000 * 60));
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    const diffMonths = Math.round(diffMs / (1000 * 60 * 60 * 24 * 30.44));
    const diffYears = Math.round(diffMs / (1000 * 60 * 60 * 24 * 365.25));

    if (diffMinutes < 1) return "just now";
    if (diffMinutes < 60) return `${diffMinutes} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffMonths < 12) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
    return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
};

const RecentActivityFeed: React.FC<RecentActivityFeedProps> = ({activities, onViewAllClick}) => {
    return (
        <div className={styles.container}>

            <div className={styles.header}>
                <h3 className={styles.title}>Recent Activity</h3>
                {onViewAllClick && (
                    <button className={styles.viewAllButton} onClick={onViewAllClick}>
                        View All
                    </button>
                )}
            </div>

            <div className={styles.activityList}>
                {activities.length > 0 ? (
                    activities.map(activity => (
                        <div key={activity.userId} className={styles.activityItem}>
                            {/* Avatar */}
                            <Link href={`/membership/${activity.userId}`} className={styles.avatarAndNameLink}>
                                <div className={styles.avatar}>
                                    {activity.profileImageKey ? (
                                        <Image
                                            src={activity.profileImageKey}
                                            alt={`${activity.firstName}'s profile`}
                                            className={styles.profileImage}
                                            width={40}
                                            height={40}
                                        />
                                    ) : (
                                        <span className={styles.avatarLetter}>
                                        {activity.firstName.charAt(0).toUpperCase()}
                                    </span>
                                    )}
                                </div>
                            </Link>
                            {/* Activity Details */}
                            <div className={styles.details}>
                                <div className={styles.nameAndDescription}>
                                    <Link href={`/membership/${activity.userId}`} className={styles.fullName}>
                                        {activity.firstName}
                                    </Link>
                                    <span className={styles.description}>{activity.description}</span>
                                </div>
                                <span className={styles.timestamp}>
                                    {formatTimeAgo(activity.timestamp)}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={styles.noActivity}>No recent activity to display.</div>
                )}
            </div>
        </div>
    );
};

export default RecentActivityFeed;
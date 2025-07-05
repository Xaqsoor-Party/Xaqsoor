import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from "next/image";

import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import useDashboardApi from "@/api/hooks/useDashboardApi";
import {RecentActivityDto} from "@/types/dashboard";
import ActionButton from "@/components/common/ActionButton/ActionButton";
import styles from '@/styles/RecentActivitiesPage.module.css';
import {extractErrorMessage} from "@/util/extractErrorMessage";
import Head from "next/head";

const RecentActivitiesPage: React.FC = () => {
    const router = useRouter();
    const { getRecentActivities } = useDashboardApi();
    const [activities, setActivities] = useState<RecentActivityDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        currentPage: 0,
        pageSize: 10,
        totalItems: 0,
        orderBy: 'desc' as 'asc' | 'desc'
    });

    useEffect(() => {
        void fetchActivities();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagination.currentPage, pagination.pageSize, pagination.orderBy]);

    const fetchActivities = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await getRecentActivities(
                pagination.currentPage,
                pagination.pageSize,
                pagination.orderBy
            );

            const activities = response.data?.recentActivities?.activities;
            const totalItems = response.data?.recentActivities?.totalItems;
            if (activities && totalItems !== undefined) {
                setActivities(activities);
                setPagination(prev => ({
                    ...prev,
                    totalItems
                }));
            } else {
                setError('Failed to load recent activities. Data is missing.');
            }
        } catch (err) {
            setError(extractErrorMessage(err,'Failed to load recent activities. Please try again later.'));
        } finally {
            setIsLoading(false);
        }
    };

    const handlePageChange = (newPage: number) => {
        const totalPages = Math.ceil(pagination.totalItems / pagination.pageSize);
        if (newPage >= 0 && newPage < totalPages) {
            setPagination(prev => ({ ...prev, currentPage: newPage }));
        }
    };


    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPagination(prev => ({
            ...prev,
            pageSize: parseInt(e.target.value),
            currentPage: 0
        }));
    };

    const handleOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPagination(prev => ({
            ...prev,
            orderBy: e.target.value as 'asc' | 'desc'
        }));
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString([], {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleUserClick = (userId: number) => {
        void router.push(`/membership/${userId}`);
    };

    const breadcrumbData = [
        { label: 'Dashboard', link: '/' },
        { label: 'Recent Activities', link: '/recent-activities' },
    ];

    const totalPages = Math.ceil(pagination.totalItems / pagination.pageSize);

    return (
       <>
           <Head>
               <title>Recent Activities • Xaqsoor</title>
               <meta
                   name="description"
                   content="Track user actions and system events with detailed recent activities on the Xaqsoor platform."
               />
           </Head>
           <div className={styles.container}>
               <Breadcrumb breadcrumbs={breadcrumbData} />
               <div className={styles.headerSection}>
                   <h1 className={styles.header}>Recent Activities</h1>
                   <p className={styles.subHeader}>Track user actions and system events</p>
               </div>

               {error && (
                   <div className={styles.errorMessage}>
                       {error}
                       <ActionButton
                           onClick={fetchActivities}
                           className={styles.retryButton}
                       >
                           Retry
                       </ActionButton>
                   </div>
               )}

               <div className={styles.controls}>
                   <div className={styles.controlGroup}>
                       <label className={styles.controlLabel}>Items per page:</label>
                       <select
                           value={pagination.pageSize}
                           onChange={handlePageSizeChange}
                           className={styles.controlSelect}
                       >
                           <option value="5">5</option>
                           <option value="10">10</option>
                           <option value="20">20</option>
                           <option value="50">50</option>
                       </select>
                   </div>

                   <div className={styles.controlGroup}>
                       <label className={styles.controlLabel}>Sort order:</label>
                       <select
                           value={pagination.orderBy}
                           onChange={handleOrderChange}
                           className={styles.controlSelect}
                       >
                           <option value="desc">Newest First</option>
                           <option value="asc">Oldest First</option>
                       </select>
                   </div>
               </div>

               <div className={styles.card}>
                   {isLoading ? (
                       <div className={styles.loadingContainer}>
                           <div className={styles.loadingSpinner} />
                           <p>Loading activities...</p>
                       </div>
                   ) : activities.length === 0 ? (
                       <div className={styles.emptyState}>
                           <p>No activities found</p>
                       </div>
                   ) : (
                       <table className={styles.activitiesTable}>
                           <thead>
                           <tr>
                               <th className={styles.userHeader}>User</th>
                               <th className={styles.actionHeader}>Action</th>
                               <th className={styles.timeHeader}>Timestamp</th>
                           </tr>
                           </thead>
                           <tbody>
                           {activities.map((activity, index) => (
                               <tr key={index} className={index % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                                   <td className={styles.userCell}>
                                       <div
                                           className={styles.userInfo}
                                           onClick={() => handleUserClick(activity.userId)} // Make entire userInfo clickable
                                       >
                                           {activity.profileImageKey ? (
                                               <Image
                                                   src={activity.profileImageKey}
                                                   alt={activity.firstName}
                                                   className={styles.avatar}
                                                   width={40}
                                                   height={40}
                                               />
                                           ) : (
                                               <div className={styles.avatarPlaceholder}>
                                                   {activity.firstName.charAt(0)}
                                               </div>
                                           )}
                                           <div className={styles.userNameContainer}>
                                               <div className={styles.userName}>
                                                   {activity.firstName}
                                               </div>
                                           </div>
                                       </div>
                                   </td>
                                   <td className={styles.actionCell}>
                                       {activity.description}
                                   </td>
                                   <td className={styles.timeCell}>
                                       {formatDate(activity.timestamp)}
                                   </td>
                               </tr>
                           ))}
                           </tbody>
                       </table>
                   )}

                   <div className={styles.pagination}>
                       <div className={styles.paginationInfo}>
                           Showing {pagination.currentPage * pagination.pageSize + 1}
                           –
                           {Math.min((pagination.currentPage + 1) * pagination.pageSize, pagination.totalItems)} of {pagination.totalItems} activities
                       </div>

                       <div className={styles.paginationControls}>
                           <ActionButton
                               onClick={() => handlePageChange(pagination.currentPage - 1)}
                               disabled={pagination.currentPage === 0 || isLoading}
                               className={styles.paginationButton}
                           >
                               Previous
                           </ActionButton>

                           <div className={styles.pageIndicator}>
                               Page {pagination.currentPage + 1} of {totalPages || 1}
                           </div>

                           <ActionButton
                               onClick={() => handlePageChange(pagination.currentPage + 1)}
                               disabled={pagination.currentPage >= totalPages - 1 || isLoading}
                               className={styles.paginationButton}
                           >
                               Next
                           </ActionButton>
                       </div>
                   </div>
               </div>
           </div>
       </>
    );
};

export default RecentActivitiesPage;

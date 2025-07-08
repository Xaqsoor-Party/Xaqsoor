import React, {useEffect, useState} from 'react';
import useDashboardApi from '@/api/hooks/useDashboardApi';
import {DashboardSummaryDto, RecentActivityListDto, SystemHealthDto,} from '@/types/dashboard';
import styles from '../styles/Home.module.css';
import DashboardCard from '../components/Dashboard/DashboardCard/DashboardCard';
import UserGrowthChart from '../components/Dashboard/UserGrowthChart/UserGrowthChart';

import {FaChartLine, FaEnvelopeOpenText, FaHeartbeat, FaHistory, FaLock, FaUsers} from 'react-icons/fa';
import {IoShieldCheckmarkSharp} from "react-icons/io5";
import {useAuthentication} from "@/auth/AuthProvider";
import SpinLoading from "@/components/common/SpinLoading/SpinLoading";
import GenderDonutChart from "@/components/Dashboard/GenderDonutChart/GenderDonutChart";
import MultiSeriesDoughnutChart from "@/components/Dashboard/MultiSeriesDoughnutChart/MultiSeriesDoughnutChart";
import BarChart from "@/components/Dashboard/BarChart/BarChart";
import DataTable, {TableColumn} from "@/components/Dashboard/DataTable/DataTable";
import RecentActivityFeed from "@/components/Dashboard/RecentActivityFeed/RecentActivityFeed";
import {extractErrorMessage} from "@/util/extractErrorMessage";
import {useRouter} from "next/router";
import Head from "next/head";

const Dashboard = () => {
    const {getDashboardSummary, getRecentActivities, getSystemHealthMetrics} = useDashboardApi();
    const {user} = useAuthentication();
    const router = useRouter();
    const [summary, setSummary] = useState<DashboardSummaryDto | null>(null);
    const [recentActivities, setRecentActivities] = useState<RecentActivityListDto | null>(null);
    const [systemHealth, setSystemHealth] = useState<SystemHealthDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [forceChartRefresh, setForceChartRefresh] = useState(false);

    const [currentDate, setCurrentDate] = useState('');
    const [dayName, setDayName] = useState('');

    useEffect(() => {
        const today = new Date();
        const optionsDate: Intl.DateTimeFormatOptions = {year: 'numeric', month: 'long', day: 'numeric'};
        const optionsDay: Intl.DateTimeFormatOptions = {weekday: 'long'};

        setCurrentDate(today.toLocaleDateString(undefined, optionsDate));
        setDayName(today.toLocaleDateString(undefined, optionsDay));
    }, []);

    const fetchData = async (forceRefresh: boolean = false) => {
        setLoading(true);
        setError(null);
        try {
            const [
                summaryRes,
                recentActivitiesRes,
                systemHealthRes
            ] = await Promise.all([
                getDashboardSummary(forceRefresh),
                getRecentActivities(0, 5, 'desc'),
                getSystemHealthMetrics(forceRefresh)
            ]);

            setSummary(summaryRes.data?.dashboardSummary ?? null);
            setRecentActivities(recentActivitiesRes.data?.recentActivities ?? null);
            setSystemHealth(systemHealthRes.data?.systemHealth ?? null);

        } catch (err) {
            setError(extractErrorMessage(err, "An unexpected error occurred while fetching dashboard data."));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleRefresh = () => {
        void fetchData(true);
        setForceChartRefresh(true);
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <SpinLoading size={50}/>
                <p>Loading dashboard data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.errorContainer}>
                <h2>Error</h2>
                <p>{error}</p>
                <button onClick={handleRefresh} className={styles.refreshButton}>Try Again</button>
            </div>
        );
    }

    const roleData = summary
        ? Object.entries(summary.roleDistribution).map(([role, count]) => ({
            role,
            count,
        }))
        : [];

    const roleColumns: TableColumn<{ role: string; count: number }>[] = [
        {header: 'Role', accessor: 'role'},
        {header: 'Count', accessor: 'count'}
    ];

    const formatUptime = (minutes: number) => {
        if (minutes < 60) return `${minutes} minutes`;

        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;

        if (hours < 24) return `${hours}h ${remainingMinutes}m`;

        const days = Math.floor(hours / 24);
        const remainingHours = hours % 24;
        return `${days}d ${remainingHours}h ${remainingMinutes}m`;
    };

    const handleViewAllClick = () => {
        void router.push("/recent-activities");
    };

    return (
        <>
            <Head>
                <title>Dashboard • Xaqsoor</title>
                <meta
                    name="description"
                    content="Overview of user statistics, recent activities, and system health metrics on the Xaqsoor platform."
                />
            </Head>

            <div className={styles.dashboardContainer}>
                <div className={styles.dashboardHeader}>
                    <div>
                        <h1 className={styles.mainTitle}>
                            Hello, {user?.firstName || 'Admin'}!
                        </h1>
                        <p className={styles.dateInfo}>
                            {dayName}, {currentDate}
                        </p>
                    </div>
                    <div className={styles.headerControls}>
                        <button onClick={handleRefresh} className={styles.refreshButton}>
                            <FaHistory/> Refresh Data
                        </button>
                    </div>
                </div>

                {/* Dashboard Summary Section */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Overview</h2>
                    {summary && (
                        <>
                            <div className={styles.dashboardGrid}>
                                <DashboardCard
                                    title="Total Members"
                                    value={summary.totalMembers.toLocaleString()}
                                    icon={<FaUsers/>}
                                    colorVar="--color-primary-light"
                                />
                                <DashboardCard
                                    title="New Members (This Month)"
                                    value={summary.newMembersThisMonth.toLocaleString()}
                                    icon={<FaChartLine/>}
                                    description="Growth this month"
                                    colorVar="--color-secondary-dark"
                                />
                                <DashboardCard
                                    title="Profile Completion Rate"
                                    value={`${summary.profileCompletionRate.toFixed(2)}%`}
                                    icon={<IoShieldCheckmarkSharp/>}
                                    description="Average profile completeness"
                                    colorVar="--color-success"
                                />
                                <DashboardCard
                                    title="MFA Enabled Users"
                                    value={summary.mfaEnabledUsers.toLocaleString()}
                                    icon={<FaLock/>}
                                    description="Users with MFA enabled"
                                    colorVar="--color-primary-accent"
                                />
                                <DashboardCard
                                    title="Locked Accounts"
                                    value={summary.lockedAccounts.toLocaleString()}
                                    icon={<FaLock/>}
                                    description="Accounts temporarily locked"
                                    colorVar="--color-error"
                                />
                                <DashboardCard
                                    title="Unverified Emails"
                                    value={summary.unverifiedEmails.toLocaleString()}
                                    icon={<FaEnvelopeOpenText/>}
                                    description="Users with unverified emails"
                                    colorVar="--color-warning"
                                />
                            </div>

                            <div className={styles.distributionSection}>
                                <div className={styles.chartPanel}>
                                    <div className={styles.barChartBlock}>
                                        <BarChart
                                            dataObject={summary.userStatusDistribution}
                                            title="User Status Distribution"
                                            orientation="vertical"
                                        />
                                    </div>
                                    <div className={styles.genderChartBlock}>
                                        <GenderDonutChart maleCount={summary.maleCount} femaleCount={summary.femaleCount}/>
                                    </div>
                                </div>

                                <div className={styles.tablePanel}>
                                    <div className={styles.tableBlock}>
                                        <DataTable
                                            data={roleData}
                                            columns={roleColumns}
                                            title="Role Distribution"
                                            getRowKey={(row) => row.role}
                                        />
                                    </div>
                                    <div className={styles.chartBlock}>
                                        <MultiSeriesDoughnutChart
                                            title="Membership Level Distribution"
                                            labels={Object.keys(summary.membershipLevelDistribution)}
                                            dataSeries={[
                                                {
                                                    label: 'Members',
                                                    counts: Object.values(summary.membershipLevelDistribution),
                                                },
                                            ]}
                                            showLegend={true}
                                        />
                                    </div>
                                </div>
                            </div>

                            <p className={styles.lastUpdated}>Summary Last Updated: {summary.lastUpdated}</p>
                        </>
                    )}
                </div>

                <hr className={styles.sectionDivider}/>


                <div className={styles.section}>
                    <div className={styles.chartAndActivity}>
                        <div className={styles.userGrowthChartWrapper}>
                            <UserGrowthChart
                                forceRefresh={forceChartRefresh}
                                setForceRefresh={setForceChartRefresh}
                            />
                        </div>
                        <div className={styles.recentActivityWrapper}>
                            {recentActivities && (
                                <RecentActivityFeed
                                    activities={recentActivities.activities}
                                    onViewAllClick={handleViewAllClick}
                                />
                            )}
                        </div>
                    </div>
                </div>

                <hr className={styles.sectionDivider}/>

                {/* System Health Section */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>System Health Metrics</h2>
                    {systemHealth && (
                        <div className={styles.systemHealthGrid}>
                            <DashboardCard
                                title="CPU Load"
                                value={`${systemHealth.cpuLoad.toFixed(2)}%`}
                                icon={<FaHeartbeat/>}
                                colorVar="--color-primary-light"
                            />
                            <DashboardCard
                                title="Total Memory"
                                value={`${(systemHealth.totalMemory / 1e9).toFixed(2)} GB`}
                                icon={<FaHeartbeat/>}
                                colorVar="--color-secondary-dark"
                            />
                            <DashboardCard
                                title="Used Memory"
                                value={`${(systemHealth.usedMemory / 1e9).toFixed(2)} GB`} icon={<FaHeartbeat/>}
                                colorVar="--color-error"
                            />
                            <DashboardCard
                                title="Free Memory"
                                value={`${(systemHealth.freeMemory / 1e9).toFixed(2)} GB`}
                                icon={<FaHeartbeat/>}
                                colorVar="--color-success"
                            />
                            <DashboardCard
                                title="System Uptime"
                                value={formatUptime(systemHealth.uptime)}
                                icon={<FaHeartbeat/>}
                                colorVar="--color-primary-accent"
                            />
                            <DashboardCard
                                title="Active Threads"
                                value={systemHealth.activeThreads.toLocaleString()}
                                icon={<FaHeartbeat/>}
                                colorVar="--color-warning"
                            />
                        </div>
                    )}
                    <p className={styles.lastUpdated}>System Health Last Updated: {systemHealth?.lastUpdated}</p>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
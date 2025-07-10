import Head from "next/head";
import React, {useEffect, useState} from "react";
import useUserCommunicationApi from "@/api/hooks/useUserCommunicationApi";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import styles from "@/styles/Messages.module.css";
import {EmailDashboardDto} from "@/types/dashboard";
import {extractErrorMessage} from "@/util/extractErrorMessage";
import {FiAlertCircle, FiCheckCircle, FiDownload, FiInfo, FiMail, FiSend, FiTrash2} from "react-icons/fi";
import DashboardCard from "@/components/Dashboard/DashboardCard/DashboardCard";
import BarChart from "@/components/Dashboard/BarChart/BarChart";
import ActionCard from "@/components/Dashboard/ActionCard/ActionCard";
import {useRouter} from "next/router";

type FetchState = {
    loading: boolean;
    error: string | null;
};

const Emails = () => {
    const {getEmailCampaignDashboardData} = useUserCommunicationApi();
    const [dashboardData, setDashboardData] = useState<EmailDashboardDto | null>(null);
    const [fetchState, setFetchState] = useState<FetchState>({ loading: true, error: null });

    const fetchDashboardData = async () => {
        try {
            setFetchState({ loading: true, error: null });
            const response = await getEmailCampaignDashboardData();
            if (response.code === 200 && response.data?.emailDashboard) {
                setDashboardData(response.data.emailDashboard);
            } else {
                setFetchState({ loading: false, error: "Failed to load dashboard data" });
            }
        } catch (err) {
            setFetchState({ loading: false, error: extractErrorMessage(err,"An error occurred while fetching data") });
        } finally {
            setFetchState({ loading: false, error: null });
        }
    };

    useEffect(() => {
        void fetchDashboardData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const breadcrumbData = [
        {label: 'Home', link: '/'},
        {label: 'Emails', link: '/campaign/emails'},
    ];
    const router = useRouter();

    return (
        <>
            <Head>
                <title>Emails • Xaqsoor</title>
            </Head>

            <div className={styles.container}>
                <Breadcrumb breadcrumbs={breadcrumbData}/>
                <h1 className={styles.pageTitle}>Email Campaign Dashboard</h1>
                <p className={styles.pageSubtitle}>
                    Overview of <strong>email verification statuses</strong> and <strong>domain distribution statistics</strong>.
                </p>


                {fetchState.loading && (
                    <div className={styles.statusMessage}>
                        <FiInfo className={styles.icon}/>
                        Loading operator counts...
                    </div>
                )}

                {fetchState.error && (
                    <div className={styles.errorMessage}>
                        <FiAlertCircle className={styles.icon}/>
                        {fetchState.error}
                    </div>
                )}

                {!fetchState.loading && !fetchState.error && !dashboardData  && (
                    <div className={styles.infoMessage}>
                        <FiInfo className={styles.icon}/>
                        No operator data available.
                    </div>
                )}

                {!fetchState.loading && !fetchState.error && dashboardData && (
                    <div className={styles.cardGrid}>
                        <DashboardCard
                            title="Verified Emails"
                            value={dashboardData.verifiedEmails}
                            description="Emails that have been verified"
                            colorVar="--color-success"
                            icon={<FiCheckCircle size={24} />}
                        />
                        <DashboardCard
                            title="Unverified Emails"
                            value={dashboardData.unverifiedEmails}
                            description="Emails not yet verified"
                            colorVar="--color-warning"
                            icon={<FiMail size={24} />}
                        />
                        <DashboardCard
                            title="Deleted Emails"
                            value={dashboardData.deletedEmails}
                            description="Emails marked as deleted"
                            colorVar="--color-error"
                            icon={<FiTrash2 size={24} />}
                        />
                    </div>
                )}

                {!fetchState.loading && !fetchState.error && dashboardData?.domainCounts && Object.keys(dashboardData.domainCounts).length > 0 && (
                    <div style={{ width: '100%'}}>
                        <BarChart
                            title="Email Domain Distribution"
                            dataObject={dashboardData.domainCounts}
                            orientation="vertical"
                        />
                    </div>
                )}

                <h2 className={styles.actionsSectionTitle}>Email Actions</h2>
                <p className={styles.actionsSectionSubtitle}>
                    Quickly perform common tasks related to email campaigns.
                </p>

                <div className={styles.actionCardsGrid}>
                    <ActionCard
                        title="Send Email"
                        subtitle="Send a single email to a specific recipient."
                        icon={<FiSend />}
                        onClick={() => router.push("/campaign/emails/send")}
                        colorClass={styles.sendCard}
                    />
                    <ActionCard
                        title="Bulk Email"
                        subtitle="Send emails to multiple recipients or groups."
                        icon={<FiMail />}
                        onClick={() => router.push("/campaign/emails/bulk-send")}
                        colorClass={styles.bulkEmailCard}
                    />
                    <ActionCard
                        title="Export Emails"
                        subtitle="Download a CSV of your email lists."
                        icon={<FiDownload />}
                        onClick={() => router.push("/campaign/emails/export")}
                        colorClass={styles.downloadCard}
                    />
                </div>
            </div>
        </>
    )
}
export default Emails;
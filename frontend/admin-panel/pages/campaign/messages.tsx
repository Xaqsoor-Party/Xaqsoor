import Head from "next/head";
import React, {useEffect, useState} from "react";
import useUserCommunicationApi from "@/api/hooks/useUserCommunicationApi";
import {extractErrorMessage} from "@/util/extractErrorMessage";
import {FiAlertCircle, FiDownload, FiInfo, FiPhone, FiSend} from "react-icons/fi";
import DashboardCard from "@/components/Dashboard/DashboardCard/DashboardCard";
import {FaTelegramPlane, FaWhatsapp} from "react-icons/fa";
import {useRouter} from "next/router";
import ActionCard from "@/components/Dashboard/ActionCard/ActionCard";
import styles from "@/styles/Messages.module.css";

const Messages = () => {
    const {getPhoneOperatorUserCount} = useUserCommunicationApi();
    const router = useRouter();

    const [operatorCounts, setOperatorCounts] = useState<Record<string, number> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOperatorCounts = async () => {
        try {
            const data = await getPhoneOperatorUserCount();
            setOperatorCounts(data);
        } catch (err) {
            setError(extractErrorMessage(err, "Failed to load operator counts."));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void fetchOperatorCounts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const knownOperatorColors: Record<string, string> = {
        "Hormuud": "#4CAF50",
        "Somtel": "#2196F3",
        "Telesom": "#FF5722",
        "SomLink": "#00BCD4",
        "SomNet": "#673AB7",
        "NationLink": "#FFC107",
        "Amtel": "#795548",
        "Golis": "#E91E63",
    };

    const getRandomHexColor = () => {
        return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    };

    return (
        <>
            <Head>
                <title>Messages • Xaqsoor</title>
            </Head>

            <div className={styles.container}>

                <h1 className={styles.pageTitle}>Communications Dashboard</h1>
                <p className={styles.pageSubtitle}>
                    Overview of user distribution by network operator and quick access to messaging tools.
                </p>

                {loading && (
                    <div className={styles.statusMessage}>
                        <FiInfo className={styles.icon}/>
                        Loading operator counts...
                    </div>
                )}

                {error && (
                    <div className={styles.errorMessage}>
                        <FiAlertCircle className={styles.icon}/>
                        {error}
                    </div>
                )}

                {!loading && !error && (!operatorCounts || Object.keys(operatorCounts).length === 0) && (
                    <div className={styles.infoMessage}>
                        <FiInfo className={styles.icon}/>
                        No operator data available.
                    </div>
                )}

                {!loading && !error && operatorCounts && Object.keys(operatorCounts).length > 0 && (
                    <div className={styles.cardGrid}>
                        {Object.entries(operatorCounts).map(([operator, count]) => {
                            const cardColor = knownOperatorColors[operator] || getRandomHexColor();
                            return (
                                <DashboardCard
                                    key={operator}
                                    title={operator}
                                    value={count}
                                    description={`Members using ${operator}`}
                                    icon={<FiPhone/>}
                                    colorVar={cardColor}
                                    isRawColor={true}
                                />
                            );
                        })}
                    </div>
                )}

                {/* Refactored Actions Section */}
                <h2 className={styles.actionsSectionTitle}>Quick Actions</h2>
                <p className={styles.actionsSectionSubtitle}>
                    Perform various communication-related tasks.
                </p>
                <div className={styles.actionCardsGrid}>
                    <ActionCard
                        title="Download CSV"
                        subtitle="Export user phone numbers for external use."
                        icon={<FiDownload />}
                        onClick={() => router.push("/campaign/export-csv")}
                        colorClass={styles.downloadCard}
                    />

                    <ActionCard
                        title="Send Message"
                        subtitle="Compose and send SMS messages to members."
                        icon={<FiSend />}
                        onClick={() => router.push("/campaign/send")}
                        colorClass={styles.sendCard}
                    />

                    <ActionCard
                        title="WhatsApp"
                        subtitle="Initiate conversations via WhatsApp."
                        icon={<FaWhatsapp color="#FFF" />}
                        onClick={() => router.push("/campaign/send-whatsapp")}
                        colorClass={styles.whatsappCard}
                    />

                    <ActionCard
                        title="Telegram"
                        subtitle="Send messages through Telegram."
                        icon={<FaTelegramPlane color="#FFF" />}
                        onClick={() => router.push("/campaign/send-telegram")}
                        colorClass={styles.telegramCard}
                    />
                </div>

            </div>
        </>
    );
};

export default Messages;
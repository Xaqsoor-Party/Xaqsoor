import Head from "next/head";
import React from "react";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import UnderConstructionPage from "@/components/UnderConstructionPage/UnderConstructionPage";

const SendTelegramMessage = () => {
    const breadcrumbData = [
        { label: 'Home', link: '/' },
        { label: 'Messages', link: '/campaign/messages' },
        { label: 'Send Telegram Message', link: '/campaign/messages/send-telegram' },
    ];

    return (
        <>
            <Head>
                <title>Send Telegram Message • Xaqsoor</title>
            </Head>
            <div>
                <Breadcrumb breadcrumbs={breadcrumbData} />
                <UnderConstructionPage/>
            </div>
        </>
    );
};

export default SendTelegramMessage;

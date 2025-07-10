import Head from "next/head";
import React from "react";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import UnderConstructionPage from "@/components/UnderConstructionPage/UnderConstructionPage";

const SendSingleMessage = () => {
    const breadcrumbData = [
        { label: 'Home', link: '/' },
        { label: 'Messages', link: '/campaign/messages' },
        { label: 'Send Message', link: '/campaign/messages/send' },
    ];

    return (
        <>
            <Head>
                <title>Send Message • Xaqsoor</title>
            </Head>
            <div>
                <Breadcrumb breadcrumbs={breadcrumbData} />
                <UnderConstructionPage/>
            </div>
        </>
    );
};

export default SendSingleMessage;

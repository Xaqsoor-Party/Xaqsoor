import Head from "next/head";
import React from "react";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import UnderConstructionPage from "@/components/UnderConstructionPage/UnderConstructionPage";

const SendWhatsappMessage = () => {
    const breadcrumbData = [
        { label: 'Home', link: '/' },
        { label: 'Messages', link: '/campaign/messages' },
        { label: 'Send WhatsApp Message', link: '/campaign/messages/send-whatsapp' },
    ];

    return (
        <>
            <Head>
                <title>Send WhatsApp Message • Xaqsoor</title>
            </Head>
            <div>
                <Breadcrumb breadcrumbs={breadcrumbData} />
                <UnderConstructionPage/>
            </div>
        </>
    );
};

export default SendWhatsappMessage;

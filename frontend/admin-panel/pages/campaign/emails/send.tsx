import Head from "next/head";
import UnderConstructionPage from "@/components/UnderConstructionPage/UnderConstructionPage";
import React from "react";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";

const SendSingleEmail = () => {
    const breadcrumbData = [
        { label: 'Home', link: '/' },
        { label: 'Emails', link: '/campaign/emails' },
        { label: 'Send Email', link: '/campaign/emails/send' },
    ];

    return (
        <>
            <Head>
                <title>Send Email • Xaqsoor</title>
            </Head>
            <div>
                <Breadcrumb breadcrumbs={breadcrumbData} />
                <UnderConstructionPage/>
            </div>
        </>
    );
};

export default SendSingleEmail;

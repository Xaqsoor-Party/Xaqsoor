import Head from "next/head";
import UnderConstructionPage from "@/components/UnderConstructionPage/UnderConstructionPage";
import React from "react";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";

const BulkEmailSend = () => {
    const breadcrumbData = [
        { label: 'Home', link: '/' },
        { label: 'Emails', link: '/campaign/emails' },
        { label: 'Bulk Send', link: '/campaign/emails/bulk-send' },
    ];

    return (
        <>
            <Head>
                <title>Bulk Email Send • Xaqsoor</title>
            </Head>
            <div>
                <Breadcrumb breadcrumbs={breadcrumbData} />
                <UnderConstructionPage/>
            </div>
        </>
    );
};

export default BulkEmailSend;

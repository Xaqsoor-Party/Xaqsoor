import Head from "next/head";
import UnderConstructionPage from "@/components/UnderConstructionPage/UnderConstructionPage";
import React from "react";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";

const Export = () => {
    const breadcrumbData = [
        {label: 'Home', link: '/'},
        {label: 'Emails', link: '/campaign/emails'},
        {label: 'Export Emails', link: '/campaign/emails/export'},
    ];

    return (
        <>
            <Head>
                <title>Export Emails • Xaqsoor</title>
            </Head>
            <div>
                <Breadcrumb breadcrumbs={breadcrumbData}/>
                <UnderConstructionPage/>
            </div>
        </>
    )
}

export default Export;
import "@/styles/globals.css";
import type {AppProps} from "next/app";
import {LanguageProvider} from "@/context/LanguageContext";

import {useRouter} from "next/router";
import Head from "next/head";
import {AuthProvider} from "@/auth/AuthProvider";
import RedirectAuthenticated from "@/components/common/RedirectAuthenticated";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { Layout } from "@/components/Layout";
import React from "react";

export default function App({Component, pageProps}: AppProps) {
    const router = useRouter();
    const isAuthPath = router.pathname.startsWith('/auth');
    const isPublicPath = router.pathname === "/unauthorized";
    return (
        <>
            <Head>
                <title>Xaqsoor</title>
                <link rel="icon" href="/icons/Icon_Xaqsoor_Logo.png"/>
            </Head>
            <AuthProvider>
            <LanguageProvider>
                <>
                    {isAuthPath ? (
                        <RedirectAuthenticated>
                            <Component {...pageProps} />
                        </RedirectAuthenticated>
                    ) : isPublicPath ? (
                        <Component {...pageProps} />
                    ) : (
                        <ProtectedRoute>
                            <Layout>
                                <Component {...pageProps} />
                            </Layout>
                        </ProtectedRoute>
                    )}
                </>
            </LanguageProvider>
            </AuthProvider>
        </>
    );
}
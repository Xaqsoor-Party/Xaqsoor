import "@/styles/globals.css";
import type {AppProps} from "next/app";
import {LanguageProvider} from "@/context/LanguageContext";

import {useRouter} from "next/router";
import Head from "next/head";
import {AuthProvider} from "@/auth/AuthProvider";
import RedirectAuthenticated from "@/components/common/RedirectAuthenticated";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import {Layout} from "@/components/Layout";

export default function App({Component, pageProps}: AppProps) {
    const router = useRouter();
    const isAuthPath = router.pathname.startsWith('/auth');
    const isJoinPath = router.pathname.includes("join");

    return (
        <>
            <Head>
                <title>Title</title>
                <link rel="icon" href="/images/Replace_Me.svg"/>
            </Head>
            <AuthProvider>
                <LanguageProvider>
                    <>
                        {isJoinPath ? (
                            <Component {...pageProps} />
                        ) : isAuthPath ? (
                            <RedirectAuthenticated>
                                <Component {...pageProps} />
                            </RedirectAuthenticated>

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
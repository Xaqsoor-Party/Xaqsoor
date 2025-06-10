import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAuthentication } from "@/auth/AuthProvider";
import BubbleLoading from "@/components/common/BubbleLoading/BubbleLoading";

const RedirectAuthenticated = ({ children }: { children: React.ReactNode }) => {
    const { authToken, user } = useAuthentication();
    const router = useRouter();

    useEffect(() => {
        if (authToken && user) {
            // If already authenticated, redirect to home (or any protected page)
            void router.replace("/");
        }
    }, [authToken, user, router]);

    // // While redirecting show loader
    if (authToken || user) {
        return <BubbleLoading />;
    }

    return <>{children}</>;
};

export default RedirectAuthenticated;

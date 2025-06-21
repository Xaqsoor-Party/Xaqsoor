import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAuthentication } from "@/auth/AuthProvider";
import BubbleLoading from "@/components/common/BubbleLoading/BubbleLoading";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { authToken, user } = useAuthentication();
    const router = useRouter();

    useEffect(() => {
        if (!authToken || !user || user.role?.toLowerCase() === "member") {
            void router.replace("/auth/login");
        }
    }, [authToken, user, router]);

    if (!authToken || !user || user.role?.toLowerCase() === "member") {
        return <BubbleLoading />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;

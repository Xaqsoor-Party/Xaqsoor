import { useRouter } from "next/router";
import React, {useEffect, useState} from "react";
import { useAuthentication } from "@/auth/AuthProvider";
import BubbleLoading from "@/components/common/BubbleLoading/BubbleLoading";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { authToken, user } = useAuthentication();
    const router = useRouter();
    const [checkingAuth, setCheckingAuth] = useState(true);
    useEffect(() => {
        const isOnUnauthorizedPage = router.pathname === "/unauthorized";
        if (!authToken || !user) {
            void router.replace("/auth/login");
        } else if ((user.role?.toLowerCase() === "member" || user.status.toLowerCase() === "pending") && !isOnUnauthorizedPage) {
            void router.replace("/unauthorized");
        }else {
            setCheckingAuth(false);
        }
    }, [authToken, user, router]);

    if (checkingAuth) {
        return <BubbleLoading />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;

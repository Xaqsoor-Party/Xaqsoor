import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {User} from "@/types/user";
import BubbleLoading from "@/components/common/BubbleLoading/BubbleLoading";
import useAuthApi from "@/api/hooks/useAuthApi";

interface AuthContextType {
    authToken: string | null;
    user: User | null;
    setAuthToken: (token: string | null, userData: User | null) => void;
    setUser: (userData: User | null) => void;
}

const AuthContext = createContext<AuthContextType>({
    authToken: null,
    user: null,
    setAuthToken: () => {
    },
    setUser: () => {
    },
});

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({children}: AuthProviderProps) => {
    const [authToken, setAuthTokenState] = useState<string | null>(null);
    const [user, setUserState] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const {refreshToken} = useAuthApi();
    const setAuthToken = (token: string | null, userData: User | null) => {
        setAuthTokenState(token);
        setUserState(userData);
    };

    const setUser = (userData: User | null) => {
        setUserState(userData);
    };

    useEffect(() => {
        let isMounted = true;

        const renewSessionToken = async () => {
            try {
                const response = await refreshToken()
                if (isMounted) {
                    const accessToken = response.data?.accessToken;
                    const user = response.data?.userDTO;
                    if (accessToken !== undefined && user !== undefined) {
                        setAuthToken(accessToken, user);
                    }
                }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                if (isMounted) {
                    setAuthToken(null, null);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        void renewSessionToken();

        return () => {
            isMounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (isLoading) {
        return <BubbleLoading/>;
    }


    return (
        <AuthContext.Provider value={{authToken, user, setAuthToken, setUser}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthentication = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthentication must be used within an AuthProvider');
    }
    return context;
};
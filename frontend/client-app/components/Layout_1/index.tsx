import {  ReactNode } from 'react';
import Footer from './Footer/Footer';
import styles from './Layout.module.css';
import {useRouter} from "next/router";
import Nav from "@/components/Layout_1/Nav/Nav";

interface LayoutProps {
    children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
    const router = useRouter();
    const hideFooter = router.pathname === '/chat-service';
    return (
        <div className={styles.layout}>
            <div className={styles.navbarContainer}>
                <Nav/>
            </div>

            <main className={styles.mainContent}>
                {children}
            </main>

            {!hideFooter && (
                <div className={styles.footerContainer}>
                    <Footer />
                </div>
            )}
        </div>
    );
};

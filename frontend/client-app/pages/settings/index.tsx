import styles from '@/styles/Settings.module.css';
import Link from 'next/link';
import { FaUser, FaEdit, FaKey, FaShieldAlt, FaLaptop } from 'react-icons/fa';

const SettingsPage = () => {
    const settingOptions = [
        {
            title: 'Profile',
            description: 'View your profile information',
            icon: <FaUser />,
            href: '/settings/profile',
        },
        {
            title: 'Edit Profile',
            description: 'Update your name, email, or other details',
            icon: <FaEdit />,
            href: '/settings/edit-profile',
        },
        {
            title: 'Change Password',
            description: 'Update your account password',
            icon: <FaKey />,
            href: '/settings/change-password',
        },
        {
            title: 'MFA',
            description: 'Manage two-factor authentication',
            icon: <FaShieldAlt />,
            href: '/settings/mfa',
        },
        {
            title: 'Active Sessions',
            description: 'View all devices where you are currently logged in and manage your sessions',
            icon: <FaLaptop />,
            href: '/settings/sessions',
        },
    ];

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Settings</h1>
            <div className={styles.cardGrid}>
                {settingOptions.map((option) => (
                    <Link href={option.href} key={option.href} className={styles.card}>
                        <div className={styles.icon}>{option.icon}</div>
                        <div>
                            <h2>{option.title}</h2>
                            <p>{option.description}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default SettingsPage;

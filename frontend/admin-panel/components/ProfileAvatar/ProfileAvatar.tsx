import React from "react";
import styles from './ProfileAvatar.module.css';
import Image from "next/image";

type ProfileAvatarProps = {
    imageUrl?: string | null;
    firstName: string;
};

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ imageUrl, firstName = '' }) => {
    const firstLetter = firstName.charAt(0).toUpperCase();

    return (
        <div className={styles.avatarWrapper}>
            {imageUrl ? (
                <Image
                    src={imageUrl}
                    alt="Profile"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className={styles.avatarImage}
                />

            ) : (
                <div className={styles.initialsPlaceholder}>
                    <p className={styles.firstLetter}>{firstLetter}</p>
                </div>
            )}
        </div>
    );
};

export default ProfileAvatar;

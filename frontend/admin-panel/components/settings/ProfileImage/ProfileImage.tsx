import React, {ChangeEvent, useEffect, useState} from "react";
import styles from './ProfileImage.module.css';
import Image from "next/image";
import useProfileImage from "@/api/hooks/useProfileImageApi";
import {FiCheck, FiEdit3, FiX} from "react-icons/fi";
import {useAuthentication} from "@/auth/AuthProvider";


const ProfileImage: React.FC = () => {
    const {uploadProfileImage, deleteProfileImage} = useProfileImage();
    const {setUser, user} = useAuthentication();

    const [tempImgFile, setTempImgFile] = useState<File | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [currentProfileImage, setCurrentProfileImage] = useState<string | null>(user?.profileImageUrl || null);
    const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setCurrentProfileImage(user?.profileImageUrl || null);
    }, [user?.profileImageUrl]);

    const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setError('Please upload an image file');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                setError('File size must be less than 5MB');
                return;
            }
            setError(null);
            setTempImgFile(file);
            setCurrentProfileImage(URL.createObjectURL(file));
        }
    };

    const handleEditToggle = () => {
        setIsEditing(true);
        setOriginalImageUrl(currentProfileImage);
        setTempImgFile(null);
        setError(null);
    };

    const handleSave = async () => {
        if (!user) return;
        setIsLoading(true);
        setError(null);

        try {
            if (tempImgFile) {

                const response = await uploadProfileImage(
                    user.userId,
                    tempImgFile,
                );
                setUser({...user, profileImageUrl: response});

            } else if (originalImageUrl && !currentProfileImage) {
                await deleteProfileImage(user.userId);
                setUser({...user, profileImageUrl: ""});
            }
        } catch (e) {
            console.log(e);
            setError('Failed to update profile image');
            setCurrentProfileImage(originalImageUrl);
        } finally {
            setIsLoading(false);
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setCurrentProfileImage(originalImageUrl);
        setTempImgFile(null);
        setError(null);
        setIsEditing(false);
    };

    const handleDeletePhoto = () => {
        setCurrentProfileImage(null);
        setTempImgFile(null);
    };

    const firstLetter = user?.firstName.charAt(0).toUpperCase();

    return (
        <>
            <div className={styles.container}>

                <div className={styles.profilePicWrapper}>
                    {currentProfileImage ? (
                        <>
                            <Image
                                src={currentProfileImage}
                                alt="Profile Pic"
                                className={styles.profilePic}
                                fill
                                priority
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                            {isEditing && (
                                <button
                                    className={styles.deletePhotoBtn}
                                    onClick={handleDeletePhoto}
                                    disabled={isLoading}
                                >
                                    <Image src="/icons/ph_trash.svg" alt="Delete" width={32} height={32}/>
                                </button>
                            )}
                        </>
                    ) : (
                        <div className={styles.initialsPlaceholder}>
                            <p className={styles.firstLetter}>{firstLetter}</p>
                        </div>
                    )}

                    {isEditing && (
                        <>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                className={styles.profilePicInput}
                                id="profilePicInput"
                                disabled={isLoading}
                            />
                            <label htmlFor="profilePicInput" className={styles.profilePicLabel}>
                                <Image src="/icons/ph_camera-fill.svg" alt="Upload" width={56} height={56}/>
                            </label>
                        </>
                    )}
                </div>

                <div>
                    {!isEditing && (
                        <button
                            className={styles.editButton}
                            onClick={handleEditToggle}
                            disabled={isLoading}
                        >
                            <FiEdit3 size={24}/>
                        </button>
                    )}

                    {isEditing && (
                        <div className={styles.actionButtons}>
                            <button
                                className={styles.saveButton}
                                onClick={handleSave}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className={styles.spinner}/>
                                ) : (
                                    <FiCheck size={24}/>
                                )}
                            </button>
                            {!isLoading && (
                                <button
                                    className={styles.cancelButton}
                                    onClick={handleCancel}
                                    disabled={isLoading}
                                >
                                    <FiX size={24}/>
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
            {error && <div className={styles.errorMessage}>{error}</div>}
        </>
    );
};

export default ProfileImage;

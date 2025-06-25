import React, {useState, useEffect, useCallback, useRef} from "react";
import styles from "./ProfileImageUpload.module.css";
import SpinLoading from "@/components/common/SpinLoading/SpinLoading";
import Image from "next/image";
import {useLanguage} from "@/context/LanguageContext";
import useFileApi from "@/api/hooks/useFileApi";
import {extractErrorMessage} from "@/util/extractErrorMessage";

interface ProfileImageUploadProps {
    photoErrors?: string;
    onUpload?: (result: { key: string; url: string }) => void;
    uploadedImageUrl?: string;
    required?: boolean;
}

const translations = {
    en: {
        uploadPromptText: "Upload Profile Photo",
        uploadSubtext: "Recommended size: 500x500px",
        changePhotoText: "Click to change photo",
        confirmUploadButton: "Confirm Upload",
        removeButton: "Remove",
        uploadError: "Failed to upload image. Please try again.",
        imageError: "Please upload an image file",
        fileSizeError: "File size must be less than 5MB"
    },
    so: {
        uploadPromptText: "Geli Sawirka Profile-ka",
        uploadSubtext: "Cabbirka lagula talinayo: 500x500px",
        changePhotoText: "Riix si aad u beddesho sawirka",
        confirmUploadButton: "Xaqiiji Soo Gelinta",
        removeButton: "Tirtir",
        uploadError: "Sawirka lama soo gelin karin. Fadlan dib isku day.",
        imageError: "Fadlan soo geli fayl sawir ah",
        fileSizeError: "Cabbirka faylka waa inuu ka yar yahay 5MB"
    }
};

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({photoErrors,onUpload, uploadedImageUrl,required}) => {
    const {uploadFile} = useFileApi();
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(uploadedImageUrl||null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const {language} = useLanguage();

    const handleFileRead = useCallback((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result as string);
        reader.readAsDataURL(file);
    }, []);

    const validateImage = (file: File) => {
        if (!file.type.startsWith('image/')) {
            return translations[language].imageError;
        }
        if (file.size > MAX_FILE_SIZE) {
            return translations[language].fileSizeError;
        }
        return null;
    };

    useEffect(() => {
        if (image) {
            handleFileRead(image);
        } else if (!uploadedImageUrl) {
            setImagePreview(null);
        }
    }, [image, handleFileRead, uploadedImageUrl]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const validationError = validateImage(file);
        if (validationError) {
            setError(validationError);
            return;
        }

        setError(null);
        setImage(file);
    };

    const handleImageUpload = async () => {
        if (!image) return;

        setLoading(true);
        try {
            const result = await uploadFile(image, "profile-images");
            setImage(null);
            setError(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
            if (onUpload) {
                onUpload(result);
            }
        } catch (err) {
            setError(extractErrorMessage(err,translations[language].uploadError));
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        setImagePreview(null);
    };

    return (
        <div className={styles.container}>
            <div className={styles.uploadSection}>
                <label className={styles.uploadLabel}>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png, image/jpeg, image/jpg"
                        onChange={handleImageChange}
                        className={styles.inputFile}
                        disabled={loading}
                        required={required}
                    />

                    {imagePreview ? (
                        <div className={styles.imagePreviewContainer}>
                            <Image
                                src={imagePreview}
                                alt="Profile preview"
                                className={styles.previewImage}
                                width={200}
                                height={200}
                            />
                            <div className={styles.previewOverlay}>
                                <span className={styles.changeText}>{translations[language].changePhotoText}</span>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.uploadPrompt}>
                            <svg className={styles.uploadIcon} viewBox="0 0 24 24">
                                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                            </svg>
                            <span className={styles.uploadText}>{translations[language].uploadPromptText}</span>
                            <span className={styles.uploadSubtext}>{translations[language].uploadSubtext}</span>
                        </div>
                    )}
                </label>

                {image && (
                    <div className={styles.uploadActions}>
                        <button
                            className={styles.uploadButton}
                            onClick={handleImageUpload}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <SpinLoading size={20}/>
                                    <span>Uploading...</span>
                                </>
                            ) : translations[language].confirmUploadButton}
                        </button>
                        <button
                            className={styles.removeButton}
                            onClick={handleRemoveImage}
                            disabled={loading}
                        >
                            {translations[language].removeButton}
                        </button>
                    </div>
                )}
            </div>

            {error && <p className={styles.errorMessage}>{error}</p>}
            {photoErrors && <p className={styles.errorMessage}>{photoErrors}</p>}
        </div>
    );
};

export default ProfileImageUpload;
import React, {useState} from "react";
import styles from "./FileUpload.module.css";
import SpinLoading from "@/components/common/SpinLoading/SpinLoading";
import useFileStorageApi from "@/api/hooks/useFileApi";
import {extractErrorMessage} from "@/util/extractErrorMessage";

interface FileUploadProps {
    fileType: string;
    onChange: (result: { key: string; url: string } | null) => void;
    accept?: string;
    required?: boolean;
    currentFile?: string;
    error?: string;
    title: string;
    subTitle: string;
    buttonText: string;
    useBase64?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
                                                   fileType,
                                                   onChange,
                                                   accept = ".jpg,.jpeg,.png,.pdf",
                                                   required = false,
                                                   currentFile,
                                                   error,
                                                   title,
                                                   subTitle,
                                                   buttonText,
                                                   useBase64,
                                               }) => {
    const {uploadFile, deleteFile} = useFileStorageApi();
    const [loading, setLoading] = useState(false);
    const [fileError, setFileError] = useState<string | null>(null);
    const [originalFileName, setOriginalFileName] = useState<string | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) {
            setFileError(null);
            onChange(null);
            return;
        }

        if (file.size > 20 * 1024 * 1024) {
            setFileError("File size exceeds 20MB. Please upload a smaller file.");
            onChange(null);
            return;
        }

        setLoading(true);
        try {
            if (useBase64) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64String = reader.result as string;
                    setOriginalFileName(file.name);
                    setFileError(null);
                    onChange({ key: "", url: base64String });
                };
                reader.onerror = () => {
                    setFileError("Failed to read file as base64.");
                    onChange(null);
                };
                reader.readAsDataURL(file);
            } else {
                if (currentFile) {
                    await deleteFile(currentFile);
                }

                const result = await uploadFile(file, fileType);
                setFileError(null);
                setOriginalFileName(file.name);
                onChange(result);
            }
        } catch (err) {
            setFileError(extractErrorMessage(err, "Failed to process file. Please try again."));
            onChange(null);
        } finally {
            setLoading(false);
        }
    };


    const fileName = originalFileName || (currentFile ? currentFile.split("/").pop() : null);

    return (
        <div className={styles.uploadSection}>
            <div className={styles.uploadHeader}>
                <p className={styles.description}>{title}</p>
                <p className={styles.requirements}>
                    {subTitle}
                </p>
            </div>

            {loading ? (
                <div className={styles.loadingContainer}>
                    <SpinLoading/>
                    <p className={styles.loadingText}>Uploading file, please wait...</p>
                </div>
            ) : (
                <div className={styles.uploadContainer}>
                    <label className={`${styles.uploadButton} ${currentFile ? styles.hasFile : ""}`}>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className={styles.fileInput}
                            accept={accept}
                            required={required}
                        />
                        <div className={styles.buttonContent}>
                            <svg className={styles.uploadIcon} viewBox="0 0 24 24">
                                <path
                                    d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
                            </svg>
                            <span className={styles.buttonText}>
                                {fileName || buttonText}
                            </span>
                        </div>
                    </label>

                    {fileError && <div className={styles.errorMessage}>{fileError}</div>}
                    {error && <div className={styles.errorMessage}>{error}</div>}
                </div>
            )}
        </div>
    );
};

export default FileUpload;

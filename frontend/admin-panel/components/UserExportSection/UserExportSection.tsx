import React, {useEffect, useState} from "react";
import useUserExportApi from "@/api/hooks/useUserExportApi";
import ConfirmationModal from "@/components/common/ConfirmationModal/ConfirmationModal";
import ActionButton from "@/components/common/ActionButton/ActionButton";
import SpinLoading from "@/components/common/SpinLoading/SpinLoading";
import styles from "./UserExportSection.module.css";

interface UserExportSectionProps {
    filters: {
        searchTerm?: string;
        statusFilter?: string;
        roleFilter?: string;
        genderFilter?: string;
        membershipLevelFilter?: string;
    };
}

const UserExportSection: React.FC<UserExportSectionProps> = ({filters}) => {
    const {getFilteredUserCount, downloadExcel, downloadPdf} = useUserExportApi();

    const [totalUsers, setTotalUsers] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [showColorPrompt, setShowColorPrompt] = useState(false);

    useEffect(() => {
        const fetchCount = async () => {
            setLoading(true);
            try {
                const count = await getFilteredUserCount(filters);
                setTotalUsers(count);
            } catch (err) {
                console.error("Failed to fetch user count", err);
            } finally {
                setLoading(false);
            }
        };
        void fetchCount();
    }, [filters]);

    const handleExcelClick = () => {
        setShowColorPrompt(true);
    };

    const handleConfirmColor = (colorCode: boolean) => {
        setShowColorPrompt(false);
        void downloadExcel({...filters, colorCodeRows: colorCode});
    };

    const handlePdfClick = () => {
        void downloadPdf(filters);
    };

    return (
        <div className={styles.exportSection}>
            {loading ? (
                <div className={styles.loadingContainer}>
                    <SpinLoading size={40} color="#1b273d" />
                    <p className={styles.loadingText}>Loading matching users...</p>
                </div>
            ) : (
                <>
                    <p className={styles.matchingText}>
                        <strong>{totalUsers}</strong> users match the current filters.
                    </p>

                    {totalUsers > 0 ? (
                        <div className={styles.buttons}>
                            <ActionButton onClick={handleExcelClick} className={styles.excelButton}>
                                Download Excel
                            </ActionButton>
                            <ActionButton onClick={handlePdfClick} className={styles.pdfButton}>
                                Download PDF
                            </ActionButton>
                        </div>
                    ) : (
                        <p className={styles.noUsersText}>No users to export.</p>
                    )}
                </>
            )}

            {showColorPrompt && (
                <ConfirmationModal
                    title="Color-Coded Rows?"
                    message="Do you want to include color-coded rows in the Excel export?"
                    onConfirm={() => handleConfirmColor(true)}
                    onCancel={() => handleConfirmColor(false)}
                    confirmText="Yes, include colors"
                    cancelText="No, plain export"
                />
            )}
        </div>
    );
};

export default UserExportSection;

import Head from "next/head";
import React, {useEffect, useState} from "react";
import useUserCommunicationApi from "@/api/hooks/useUserCommunicationApi";
import {extractErrorMessage} from "@/util/extractErrorMessage";
import SelectInput from "@/components/common/SelectInput/SelectInput";
import {genderOptions, membershipLevelOptions, statusOptions} from "@/pages/membership/list";
import ActionButton from "@/components/common/ActionButton/ActionButton";
import FilterStyles from "@/styles/UserListPage.module.css";
import SpinLoading from "@/components/common/SpinLoading/SpinLoading";
import AlertModal from "@/components/common/AlertModal/AlertModal";
import styles from "@/components/UserExportSection/UserExportSection.module.css";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";

interface Filters {
    status: string;
    operator: string;
    gender: string;
    membershipLevel: string;
}

const ExportCsv = () => {
    const [filters, setFilters] = useState<Filters>({
        status: "",
        operator: "",
        gender: "",
        membershipLevel: "",
    });
    const [filteredCount, setFilteredCount] = useState<number | null>(null);

    const {getPhoneOperatorUserCount,getFilteredPhoneCount, downloadPhoneAndOperatorCsv} = useUserCommunicationApi();
    const [operatorOptions, setOperatorOptions] = useState<{ value: string; label: string }[]>([]);
    const [status, setStatus] = useState<{
        loading: boolean;
        error: string | null;
    }>({
        loading: true,
        error: null,
    });

    const updateFilter = (key: keyof Filters, value: string) => {
        setFilters((prev) => ({...prev, [key]: value}));
    };
    const handleResetFilters = () => {
        setFilters({
            status: "",
            operator: "",
            gender: "",
            membershipLevel: "",
        });
    };

    const fetchOperatorCounts = async () => {
        try {
            setStatus({loading: true, error: null});

            const data = await getPhoneOperatorUserCount();

            const options = Object.keys(data).map((operator) => ({
                value: operator,
                label: operator
            }));

            setOperatorOptions([
                { value: "", label: "All Operators" },
                ...options
            ]);

            setStatus({loading: false, error: null});
        } catch (err) {
            setStatus({
                loading: false,
                error: extractErrorMessage(err, "Failed to load operator options."),
            });
        }
    };

    const fetchFilteredPhoneCount = async () => {
        try {
            setStatus({loading: true, error: null});
            const count = await getFilteredPhoneCount(filters);
            setFilteredCount(count);
            setStatus({loading: false, error: null});
        } catch (err) {
            setStatus({
                loading: false,
                error: extractErrorMessage(err, "Failed to load operator options."),
            });
        }
    };

    function handleExport() {
        try {
            void downloadPhoneAndOperatorCsv(filters)
        }catch (err) {
            setStatus({
                loading: false,
                error: extractErrorMessage(err, "Failed to download phone numbers.")
            });
        }
    }

    useEffect(() => {
        void fetchOperatorCounts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        void fetchFilteredPhoneCount();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters]);


    const breadcrumbData = [
        {label: 'Home', link: '/'},
        {label: 'Messages', link: '/campaign/messages'},
        {label: 'Export CSV', link: `/campaign/messages/export-csv`},
    ];

    return (
        <div>
            <Head>
                <title>Export Phone Numbers • Xaqsoor</title>
            </Head>

            <div className={FilterStyles.container}>
                <Breadcrumb breadcrumbs={breadcrumbData}/>
                <h1 className={FilterStyles.title}>Export Phone Numbers</h1>
                <p className={FilterStyles.subtitle}>Filter user phone data and export to CSV.</p>
                <div className={FilterStyles.filters}>
                    <div className={FilterStyles.filterRow}>
                        <SelectInput
                            label="Status"
                            value={filters.status}
                            onChange={(e) => updateFilter("status", e.target.value)}
                            options={statusOptions}
                            placeholder="-- Select Status --"
                        />

                        <SelectInput
                            label="Operator"
                            value={filters.operator}
                            onChange={(e) => updateFilter("operator", e.target.value)}
                            options={operatorOptions}
                            placeholder="-- Select Operator --"
                        />

                        <SelectInput
                            label="Gender"
                            value={filters.gender}
                            onChange={(e) => updateFilter("gender", e.target.value)}
                            options={genderOptions}
                            placeholder="-- Select Gender --"
                        />
                    </div>
                    <div className={FilterStyles.filterRow}>
                        <SelectInput
                            label="Membership"
                            value={filters.membershipLevel}
                            onChange={(e) => updateFilter("membershipLevel", e.target.value)}
                            options={membershipLevelOptions}
                            placeholder="-- Select Membership Level --"
                        />

                        <ActionButton onClick={handleResetFilters} className={FilterStyles.resetButton}>
                            Reset Filters
                        </ActionButton>
                    </div>
                </div>

                <div className={styles.exportSection}>
                    {status.loading ? (
                        <div className={FilterStyles.loading}>
                            <SpinLoading size={40} color="#1b273d" />
                            <p className={FilterStyles.loadingText}>⏳ Checking how many users match your filters...</p>
                        </div>
                    ) : filteredCount == null || filteredCount <= 0 ? (
                        <div className={FilterStyles.noUsersMessage}>
                            <p>No users found matching the selected filters.</p>
                        </div>
                    ) : (
                        <>
                            <p className={styles.matchingText}>
                                <strong>{filteredCount}</strong> phone number{filteredCount > 1 ? "s" : ""} ready for export.
                            </p>
                            <div className={styles.buttons}>
                                <ActionButton onClick={handleExport} className={styles.excelButton}>
                                    Download Excel
                                </ActionButton>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {status.error && (
                <AlertModal
                    title="Error"
                    message={status.error}
                    onConfirm={() =>  setStatus({loading: false, error: null})}
                    buttonText="Close"
                    error
                />
            )}
        </div>
    )
}
export default ExportCsv;
import UserExportSection from "@/components/UserExportSection/UserExportSection";
import React, {useState} from "react";
import styles from "@/styles/UserListPage.module.css";
import SearchInput from "@/components/common/SearchInput/SearchInput";
import SelectInput from "@/components/common/SelectInput/SelectInput";
import {genderOptions, membershipLevelOptions, roleOptions, statusOptions} from "@/pages/membership/list";
import ActionButton from "@/components/common/ActionButton/ActionButton";
import Head from "next/head";


const Export = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [genderFilter, setGenderFilter] = useState("");
    const [membershipLevelFilter, setMembershipLevelFilter] = useState("");
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };
    const handleResetFilters = () => {
        setSearchTerm("");
        setStatusFilter("");
        setRoleFilter("");
        setGenderFilter("");
        setMembershipLevelFilter("");
    };

    return (
        <>
            <Head>
                <title>Export Users • Xaqsoor</title>
            </Head>
            <div className={styles.container}>
                <h1 className={styles.title}>Export Users</h1>
                <p className={styles.subtitle}>Filter and export users as Excel or PDF.</p>
                <div className={styles.filters}>
                    <div className={styles.searchBar}>
                        <SearchInput
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Search by name, email, or phone..."
                        />
                    </div>
                    <div className={styles.filterRow}>
                        <SelectInput
                            label="Status"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            options={statusOptions}
                        />

                        <SelectInput
                            label="Role"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            options={roleOptions}
                        />

                        <SelectInput
                            label="Gender"
                            value={genderFilter}
                            onChange={(e) => setGenderFilter(e.target.value)}
                            options={genderOptions}
                        />
                    </div>
                    <div className={styles.filterRow}>
                        <SelectInput
                            label="Membership"
                            value={membershipLevelFilter}
                            onChange={(e) => setMembershipLevelFilter(e.target.value)}
                            options={membershipLevelOptions}
                        />

                        <ActionButton onClick={handleResetFilters} className={styles.resetButton}>
                            Reset Filters
                        </ActionButton>
                    </div>
                </div>

                <UserExportSection
                    filters={{
                        searchTerm,
                        statusFilter,
                        roleFilter,
                        genderFilter,
                        membershipLevelFilter
                    }}
                />

            </div>
        </>
    )
}
export default Export;
import React, {useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/router';
import useUserProfileApi from '@/api/hooks/useUserProfileApi';
import {MembershipLevel, Roles, Status, UserProfileResponse} from '@/types/user';
import {ApiResponse} from '@/types/auth';
import ProfileAvatar from "@/components/ProfileAvatar/ProfileAvatar";
import styles from "@/styles/UserDetailPage.module.css";
import {
    FiAlertCircle,
    FiBookOpen,
    FiBriefcase,
    FiCalendar,
    FiCheckCircle,
    FiGlobe,
    FiInfo,
    FiKey,
    FiLock,
    FiMail,
    FiMapPin,
    FiMoreVertical,
    FiPhone,
    FiUser,
    FiUserX
} from "react-icons/fi";
import {extractErrorMessage} from "@/util/extractErrorMessage";
import SpinLoading from "@/components/common/SpinLoading/SpinLoading";
import useAdminUserApi from "@/api/hooks/useAdminUserApi";
import ConfirmationModal from "@/components/common/ConfirmationModal/ConfirmationModal";
import AlertModal from "@/components/common/AlertModal/AlertModal";
import SelectActionModal from '@/components/SelectActionModal/SelectActionModal';

const UserDetailPage = () => {
    const router = useRouter();
    const idParam = router.query.id;
    const id = typeof idParam === 'string' && /^\d+$/.test(idParam) ? parseInt(idParam, 10) : null;
    const [showDropdown, setShowDropdown] = useState(false);
    const {getUserProfile} = useUserProfileApi();
    const [alert, setAlert] = useState<{
        visible: boolean;
        title: string;
        message: string;
    }>({visible: false, title: '', message: ''});

    const [user, setUser] = useState<UserProfileResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLUListElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedAction, setSelectedAction] = useState<
        "reset-mfa" | "soft-delete" | "enable-disable" |
        "lock-unlock" | "update-role" | "update-membership" | "update-status" | null
    >(null);
    const {
        resetMfa,
        softDeleteUser,
        setUserEnabled,
        setAccountNonLocked,
        updateUserRole,
        updateMembershipLevel,
        updateUserStatus
    } = useAdminUserApi();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (!router.isReady || id === null) return; // wait until router is ready
        const fetchUser = async () => {

            if (!id || isNaN(Number(id))) {
                setLoading(false);
                setError("Invalid or missing user ID.");
            }

            try {
                const response: ApiResponse<{ profile: UserProfileResponse }> = await getUserProfile(Number(id));

                if (response.data?.profile) {
                    setUser(response.data.profile);
                } else {
                    setError('Profile data is missing from the response');
                }
            } catch (err) {
                setError(extractErrorMessage(err, 'Failed to load user profile'));
            } finally {
                setLoading(false);
            }
        };

        void fetchUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    if (loading) return (
        <div className={styles.statusContainer}>
            <SpinLoading/>
            <p className={styles.loadingText}>
                <FiInfo className={styles.statusIcon}/>
                Loading user profile...
            </p>
        </div>
    );

    if (error) return (
        <div className={styles.statusContainer}>
            <p className={styles.errorText}>
                <FiAlertCircle className={styles.statusIcon}/>
                {error}
            </p>
        </div>
    );

    if (!user) return (
        <div className={styles.statusContainer}>
            <p className={styles.notFoundText}>
                <FiUserX className={styles.statusIcon}/>
                User not found
            </p>
        </div>
    );

    const showAlert = (title: string, message: string) => {
        setAlert({visible: true, title, message});
    };

    const handleResetMfa = async () => {
        try {
            await resetMfa(userData.userId);
            void router.reload();
        } catch (e) {
            showAlert("Action Failed", extractErrorMessage(e, "Unexpected error occurred"));
        } finally {
            setShowModal(false);
            setSelectedAction(null);
        }
    };

    const handleSoftDeleteUser = async () => {
        setLoading(true);
        try {
            await softDeleteUser(userData.id);
            void router.push("/membership/list");
        } catch (e) {
            showAlert("Action Failed", extractErrorMessage(e, "Failed to soft delete user"));
        } finally {
            setLoading(false);
            setShowModal(false);
            setSelectedAction(null);
        }
    };

    // const handlePermanentDeleteUser = async () => {
    //     setLoading(true);
    //     try {
    //         await permanentlyDeleteUser(userData.id);
    //         void router.push("/membership/list");
    //     } catch (e) {
    //         extractErrorMessage(e, "Failed to permanently delete user");
    //     } finally {
    //         setLoading(false);
    //         setShowModal(false);
    //         setSelectedAction(null);
    //     }
    // };

    const handleToggleUserEnabled = async () => {
        try {
            await setUserEnabled(userData.id, !userData.enabled);
            void router.reload();
        } catch (e) {
            showAlert("Action Failed", extractErrorMessage(e, "Unexpected error occurred"));
        } finally {
            setShowModal(false);
            setSelectedAction(null);
        }
    };

    const handleToggleLock = async () => {
        try {
            await setAccountNonLocked(userData.id, !userData.accountNonLocked);
            void router.reload();
        } catch (e) {
            showAlert("Action Failed", extractErrorMessage(e, "Unexpected error occurred"));
        } finally {
            setShowModal(false);
            setSelectedAction(null);
        }
    };

    const handleUpdateRole = async (newRole: string) => {
        try {
            await updateUserRole(userData.id, newRole);
            void router.reload();
        } catch (e) {
            showAlert("Action Failed", extractErrorMessage(e, "Unexpected error occurred"));
        } finally {
            setShowModal(false);
            setSelectedAction(null);
        }
    };

    const handleUpdateMembershipLevel = async (level: string) => {
        try {
            await updateMembershipLevel(userData.id, level);
            void router.reload();
        } catch (e) {
            showAlert("Action Failed", extractErrorMessage(e, "Unexpected error occurred"));
        } finally {
            setShowModal(false);
            setSelectedAction(null);
        }
    };

    const handleUpdateStatus = async (status: string) => {
        try {
            await updateUserStatus(userData.id, status);
            void router.reload();
        } catch (e) {
            showAlert("Action Failed", extractErrorMessage(e, "Unexpected error occurred"));
        } finally {
            setShowModal(false);
            setSelectedAction(null);
        }
    };

    const {userData, academicRecords, workExperiences} = user;

    const roleOptions = Object.values(Roles).map(role => ({value: role, label: role}));
    const membershipOptions = Object.values(MembershipLevel).map(level => ({value: level, label: level}));
    const statusOptions = Object.values(Status).map(status => ({value: status, label: status}));

    return (
        <div className={styles.container}>
            <div className={styles.profileHeader}>
                <div className={styles.backgroundBox}>
                    <div className={styles.initialsCircle}>
                        <ProfileAvatar firstName={user.userData.firstName} imageUrl={user.userData.profileImageUrl}/>
                    </div>
                </div>

                <div className={styles.userInfo}>
                    <div className={styles.nameRow}>
                        <h2>{`${userData.firstName} ${userData.middleName || ''} ${userData.lastName}`}</h2>
                        <button ref={buttonRef} onClick={() => setShowDropdown(prev => !prev)}
                                className={styles.menuButton}>
                            <span className={styles.menuButtonText}>Manage</span>
                            <FiMoreVertical size={20} style={{color: 'black'}}/>
                        </button>
                        {showDropdown && (
                            <ul className={styles.dropdownMenu} ref={dropdownRef}>
                                <li onClick={() => {
                                    setSelectedAction("reset-mfa");
                                    setShowModal(true);
                                }}>Reset MFA
                                </li>
                                <li onClick={() => {
                                    setSelectedAction("soft-delete");
                                    setShowModal(true);
                                }}>Delete User
                                </li>
                                <li onClick={() => {
                                    setSelectedAction("enable-disable");
                                    setShowModal(true);
                                }}>
                                    {userData.enabled ? "Disable User" : "Enable User"}
                                </li>
                                <li onClick={() => {
                                    setSelectedAction("lock-unlock");
                                    setShowModal(true);
                                }}>
                                    {userData.accountNonLocked ? "Lock Account" : "Unlock Account"}
                                </li>
                                <li onClick={() => {
                                    setSelectedAction("update-role");
                                    setShowModal(true);
                                }}>Update Role
                                </li>
                                <li onClick={() => {
                                    setSelectedAction("update-membership");
                                    setShowModal(true);
                                }}>Update Membership Level
                                </li>
                                <li onClick={() => {
                                    setSelectedAction("update-status");
                                    setShowModal(true);
                                }}>Update Status
                                </li>
                            </ul>
                        )}
                    </div>
                    <p><FiMail/> <strong>Email:</strong> {userData.email}</p>
                    <p><FiPhone/> <strong>Phone:</strong> {userData.phone}</p>
                    <p><FiUser/> <strong>Gender:</strong> {userData.gender}</p>
                    {userData.bio && <p className={styles.bio}><strong>Bio:</strong> {userData.bio}</p>}
                </div>
            </div>

            <div className={styles.section}>
                <h3>Personal Details</h3>
                <ul className={styles.detailList}>
                    <li><FiKey/> <strong>User ID:</strong> {userData.userId}</li>
                    <li><FiCheckCircle/> <strong>Status:</strong> {userData.status}</li>
                    <li><FiBriefcase/> <strong>Role:</strong> {userData.role}</li>

                    <li style={{display: 'flex',}}>
                        <FiGlobe/> <strong>Authorities:</strong>
                        <div className={styles.authorityTags}>
                            {userData.authorities
                                .split(',')
                                .map((auth, index) => (
                                    <span key={index} className={styles.authorityTag}>
                                    {auth.trim()}
                                    </span>
                                ))}
                        </div>
                    </li>

                    <li><FiMapPin/> <strong>Place of Birth:</strong> {userData.placeOfBirth || 'N/A'}</li>
                    <li><FiCalendar/> <strong>Date of Birth:</strong> {userData.dateOfBirth || 'N/A'}</li>
                    <li><FiUser/> <strong>Last Login:</strong> {userData.lastLogin || 'N/A'}</li>
                </ul>
            </div>

            <div className={styles.section}>
                <h3>Address</h3>
                <ul className={styles.detailList}>
                    <li><FiMapPin/> <strong>Street:</strong> {userData.street || 'N/A'}</li>
                    <li><FiMapPin/> <strong>City:</strong> {userData.city || 'N/A'}</li>
                    <li><FiMapPin/> <strong>State:</strong> {userData.state || 'N/A'}</li>
                    <li><FiGlobe/> <strong>Country:</strong> {userData.country || 'N/A'}</li>
                </ul>
            </div>

            <div className={styles.section}>
                <h3>Account Settings</h3>
                <ul className={styles.detailList}>
                    <li><FiCheckCircle/> <strong>Email Verified:</strong> {userData.emailVerified ? 'Yes' : 'No'}</li>
                    <li><FiLock/> <strong>MFA Enabled:</strong> {userData.mfaEnabled ? 'Yes' : 'No'}</li>
                    <li><FiCheckCircle/> <strong>Account
                        Non-Expired:</strong> {userData.accountNonExpired ? 'Yes' : 'No'}</li>
                    <li><FiLock/> <strong>Account Non-Locked:</strong> {userData.accountNonLocked ? 'Yes' : 'No'}</li>
                    <li><FiCheckCircle/> <strong>Enabled:</strong> {userData.enabled ? 'Yes' : 'No'}</li>
                </ul>
            </div>

            {/*<div className={styles.section}>*/}
            {/*    <h3>Signature</h3>*/}
            {/*    {userData.signatureImageUrl ? (*/}
            {/*        <div className={styles.signatureDisplay}>*/}
            {/*            <Image*/}
            {/*                src={userData.signatureImageUrl}*/}
            {/*                alt="User Signature"*/}
            {/*                width={400} // Set a default width for the Image component*/}
            {/*                height={200} // Set a default height for the Image component*/}
            {/*                className={styles.signatureImage}*/}
            {/*            />*/}
            {/*     */}
            {/*      */}
            {/*    ) : (*/}
            {/*        <p>No signature available.</p>*/}
            {/*    )}*/}
            {/*</div>*/}

            <div className={styles.section}>
                <h3>Academic Records</h3>
                {academicRecords.length === 0 ? (
                    <p>No academic records available.</p>
                ) : (
                    <ul className={styles.detailList}>
                        {academicRecords.map(record => (
                            <li key={record.id}>
                                <FiBookOpen/> <strong>{record.institutionName}</strong> — {record.degree || 'N/A'}
                                <br/>
                                &nbsp;&nbsp;&nbsp;&nbsp;<strong>Field of Study:</strong> {record.fieldOfStudy}
                                <br/>
                                &nbsp;&nbsp;&nbsp;&nbsp;<strong>Level:</strong> {record.level}
                                <br/>
                                &nbsp;&nbsp;&nbsp;&nbsp;<strong>Location:</strong> {record.location}
                                <br/>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <strong>Duration:</strong> {record.startDate} to {record.currentlyStudying ? 'Present' : record.endDate || 'N/A'}
                                <br/>
                                &nbsp;&nbsp;&nbsp;&nbsp;<strong>Currently
                                Studying:</strong> {record.currentlyStudying ? 'Yes' : 'No'}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className={styles.section}>
                <h3>Work Experience</h3>
                {workExperiences.length === 0 ? (
                    <p>No work experiences available.</p>
                ) : (
                    <ul className={styles.detailList}>
                        {workExperiences.map(job => (
                            <li key={job.id}>
                                <FiBriefcase/> <strong>{job.jobTitle}</strong> at {job.companyName}
                                <br/>
                                &nbsp;&nbsp;&nbsp;&nbsp;<strong>Location:</strong> {job.location}
                                <br/>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <strong>Duration:</strong> {job.startDate} to {job.currentlyWorking ? 'Present' : job.endDate || 'N/A'}
                                <br/>
                                &nbsp;&nbsp;&nbsp;&nbsp;<strong>Currently
                                Working:</strong> {job.currentlyWorking ? 'Yes' : 'No'}
                                {job.description && (
                                    <>
                                        <br/>
                                        &nbsp;&nbsp;&nbsp;&nbsp;<strong>Description:</strong>
                                        <span>{job.description}</span>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {showModal && ["reset-mfa", "soft-delete", "enable-disable", "lock-unlock"].includes(selectedAction!) && (
                <ConfirmationModal
                    title={
                        selectedAction === "reset-mfa" ? "Reset MFA?" :
                            selectedAction === "soft-delete" ? "Delete User?" :
                                selectedAction === "enable-disable" ? (userData.enabled ? "Disable User?" : "Enable User?") :
                                    selectedAction === "lock-unlock" ? (userData.accountNonLocked ? "Lock Account?" : "Unlock Account?") :
                                        "Confirm Action"
                    }
                    message={
                        selectedAction === "reset-mfa" ? `Are you sure you want to reset MFA for ${userData.firstName}?` :
                            selectedAction === "soft-delete" ? `delete user ${userData.firstName}?` :
                                selectedAction === "enable-disable" ? `${userData.enabled ? "Disable" : "Enable"} user ${userData.firstName}?` :
                                    selectedAction === "lock-unlock" ? `${userData.accountNonLocked ? "Lock" : "Unlock"} user account for ${userData.firstName}?` :
                                        `Perform ${selectedAction} on ${userData.firstName}?`
                    }
                    className={styles.customModalStyle}
                    onConfirm={() => {
                        switch (selectedAction) {
                            case "reset-mfa":
                                return handleResetMfa();
                            case "soft-delete":
                                return handleSoftDeleteUser();
                            case "enable-disable":
                                return handleToggleUserEnabled();
                            case "lock-unlock":
                                return handleToggleLock();
                            default:
                                return;
                        }
                    }}
                    onCancel={() => {
                        setShowModal(false);
                        setSelectedAction(null);
                    }}
                />
            )}

            {showModal && ["update-role", "update-membership", "update-status"].includes(selectedAction!) && (
                <SelectActionModal
                    title={
                        selectedAction === "update-role" ? "Update User Role" :
                            selectedAction === "update-membership" ? "Update Membership Level" :
                                "Update User Status"
                    }
                    label={
                        selectedAction === "update-role" ? "Role" :
                            selectedAction === "update-membership" ? "Membership Level" :
                                "Status"
                    }
                    options={
                        selectedAction === "update-role" ? roleOptions :
                            selectedAction === "update-membership" ? membershipOptions :
                                statusOptions
                    }
                    // initialValue={selectedValue}
                    onConfirm={(value) => {
                        if (selectedAction === "update-role") return handleUpdateRole(value);
                        if (selectedAction === "update-membership") return handleUpdateMembershipLevel(value);
                        if (selectedAction === "update-status") return handleUpdateStatus(value);
                    }}
                    onCancel={() => {
                        setShowModal(false);
                        setSelectedAction(null);
                    }}
                />
            )}


            {alert.visible && (
                <AlertModal
                    title={alert.title}
                    message={alert.message}
                    error={true}
                    onConfirm={() => setAlert({...alert, visible: false})}
                    onClose={() => setAlert({...alert, visible: false})}
                />
            )}
        </div>
    );
};

export default UserDetailPage;
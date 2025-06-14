import React, {useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/router';
import useUserProfileApi from '@/api/hooks/useUserProfileApi';
import {UserProfileResponse} from '@/types/user';
import {ApiResponse} from '@/types/auth';
import ProfileAvatar from "@/components/ProfileAvatar/ProfileAvatar";
import styles from "@/styles/UserDetailPage.module.css";
import {
    FiAlertCircle,
    FiBookOpen,
    FiBriefcase,
    FiCalendar,
    FiCheckCircle,
    FiGlobe, FiInfo,
    FiKey,
    FiLock,
    FiMail,
    FiMapPin,
    FiMoreVertical,
    FiPhone,
    FiUser, FiUserX
} from "react-icons/fi";
import {extractErrorMessage} from "@/util/extractErrorMessage";
import SpinLoading from "@/components/common/SpinLoading/SpinLoading";

const UserDetailPage = () => {
    const router = useRouter();
    const idParam = router.query.id;
    const id = typeof idParam === 'string' && /^\d+$/.test(idParam) ? parseInt(idParam, 10) : null;
    const [showDropdown, setShowDropdown] = useState(false);
    const {getUserProfile} = useUserProfileApi();

    const [user, setUser] = useState<UserProfileResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLUListElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);

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
        const fetchUser = async () => {
            if (id === undefined) return; // wait until router is ready
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
                setError(extractErrorMessage(err,'Failed to load user profile'));
            } finally {
                setLoading(false);
            }
        };

        void fetchUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    if (loading) return (
        <div className={styles.statusContainer}>
            <SpinLoading />
            <p className={styles.loadingText}>
                <FiInfo className={styles.statusIcon} />
                Loading user profile...
            </p>
        </div>
    );

    if (error) return (
        <div className={styles.statusContainer}>
            <p className={styles.errorText}>
                <FiAlertCircle className={styles.statusIcon} />
                {error}
            </p>
        </div>
    );

    if (!user) return (
        <div className={styles.statusContainer}>
            <p className={styles.notFoundText}>
                <FiUserX className={styles.statusIcon} />
                User not found
            </p>
        </div>
    );

    const {userData, academicRecords, workExperiences} = user;

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
                        <button  ref={buttonRef} onClick={() => setShowDropdown(prev => !prev)} className={styles.menuButton}>
                            <FiMoreVertical size={20}/>
                        </button>
                        {showDropdown && (
                            <ul className={styles.dropdownMenu} ref={dropdownRef}>
                                <li>Reset MFA</li>
                                <li>Delete User</li>
                                <li>Enable/Disable User</li>
                                <li>Lock/Unlock Account</li>
                                <li>Update Role</li>
                                <li>Update Membership Level</li>
                                <li>Update Status</li>
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
        </div>
    );
};

export default UserDetailPage;
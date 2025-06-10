import React, {useEffect, useState} from "react";
import Input from "@/components/common/Input/Input";
import SelectInput from "@/components/common/SelectInput/SelectInput";
import TextArea from "@/components/common/TextArea/TextArea";
import DatePicker from "@/components/common/DatePicker/DatePicker";
import ActionButton from "@/components/common/ActionButton/ActionButton";
import AcademicRecordsForm from "@/components/settings/AcademicRecordsForm/AcademicRecordsForm";
import WorkExperienceForm from "@/components/settings/WorkExperienceForm/WorkExperienceForm";
import useUserProfileApi from "@/api/hooks/useUserProfileApi";
import {AcademicRecordRequest, UserProfileUpdateRequest, UserUpdateDTO, WorkExperienceRequest} from "@/types/user";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import {useAuthentication} from "@/auth/AuthProvider";
import {validateFormData} from "@/util/validateProfile";
import {extractErrorMessage} from "@/util/extractErrorMessage";
import SpinLoading from "@/components/common/SpinLoading/SpinLoading";
import AlertModal from "@/components/common/AlertModal/AlertModal";
import styles from "@/styles/EditProfile.module.css";

const EditProfile = () => {
    const [formData, setFormData] = useState({
        id: 0,
        firstName: '',
        middleName: '',
        lastName: '',
        gender: '',
        placeOfBirth: '',
        dateOfBirth: '',
        bio: '',
        street: '',
        city: '',
        state: '',
        country: ''
    });
    const [academicRecords, setAcademicRecords] = useState<AcademicRecordRequest[]>([]);
    const [workExperiences, setWorkExperiences] = useState<WorkExperienceRequest[]>([]);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState({
        profile: false,
        submit: false
    });
    const [modal, setModal] = useState({
        show: false,
        title: '',
        message: '',
        error: false,
    });

    const {getUserProfile, updateUserProfile} = useUserProfileApi();
    const {user} = useAuthentication();

    const showAlert = (title: string, message: string, error = false) => {
        setModal({
            show: true,
            title,
            message,
            error,
        });
    };

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) {
                return null;
            }
            setLoading(prev => ({...prev, profile: true}));
            try {
                const response = await getUserProfile(user?.id);
                if (response.message === "User profile retrieved successfully" && response.data?.profile) {
                    const profileData = response.data.profile;
                    setFormData({
                        id: profileData.userData.id,
                        firstName: profileData.userData.firstName || '',
                        middleName: profileData.userData.middleName || '',
                        lastName: profileData.userData.lastName || '',
                        gender: profileData.userData.gender || '',
                        placeOfBirth: profileData.userData.placeOfBirth || '',
                        dateOfBirth: profileData.userData.dateOfBirth || '',
                        bio: profileData.userData.bio || '',
                        street: profileData.userData.street || '',
                        city: profileData.userData.city || '',
                        state: profileData.userData.state || '',
                        country: profileData.userData.country || ''
                    });
                    setAcademicRecords(profileData.academicRecords || []);
                    setWorkExperiences(profileData.workExperiences || []);
                } else {
                    showAlert("Error", response.message || "Failed to update profile.", true);
                }
            } catch (error) {
                showAlert("Error", extractErrorMessage(error, "Error fetching user profile"), true);
            } finally {
                setLoading(prev => ({...prev, profile: false}));
            }
        };

        if (user?.id) {
            void fetchProfile();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = async () => {

        if (!user) {
            return null;
        }
        setLoading(prev => ({...prev, submit: true}));

        const errors = validateFormData(formData, academicRecords, workExperiences);
        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            showAlert("Validation Error", "Please correct the highlighted fields.", true);
            return;
        }

        const userUpdateDTO: UserUpdateDTO = {
            id: formData.id,
            firstName: formData.firstName,
            middleName: formData.middleName,
            lastName: formData.lastName,
            gender: formData.gender,
            placeOfBirth: formData.placeOfBirth,
            dateOfBirth: formData.dateOfBirth,
            bio: formData.bio,
            street: formData.street,
            city: formData.city,
            state: formData.state,
            country: formData.country
        };

        const updateRequest: UserProfileUpdateRequest = {
            userUpdateDTO: userUpdateDTO,
            academicRecords: academicRecords,
            workExperiences: workExperiences
        };

        try {
            const response = await updateUserProfile(user?.id, updateRequest);
            if (response.message === "User profile updated successfully") {
                showAlert("Success", "Profile updated successfully!",false);
            } else {
                showAlert("Error", response.message || "Failed to update profile.", true);
            }
        } catch (error) {
            showAlert("Error", extractErrorMessage(error, "An unexpected error occurred while updating your profile."), true);
        } finally {
            setLoading(prev => ({...prev, submit: false}));
        }
    };

    const breadcrumbData = [
        {label: 'Home', link: '/'},
        {label: 'Settings', link: '/settings'},
        {label: 'Edit Profile', link: '/settings/edit-profile'},
    ];

    return (
        <div className={styles.container}>
            <Breadcrumb breadcrumbs={breadcrumbData}/>
            <h1 className={styles.pageTitle}>Edit Profile</h1>
            <p className={styles.pageSubtitle}>Update your name, contact details, and background information.</p>
            {loading.profile ? (
                    <div className={styles.loadingContainer}>
                        <SpinLoading size={50}/>
                        <p>Loading profile...</p>
                    </div>
                ) :
                <form>
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Personal Information</h2>
                        <div className={styles.row}>
                            <Input
                                label="First Name"
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="Enter your first name"
                                required
                                maxLength={15}
                                errorMessage={errors.firstName}
                            />
                            <Input
                                label="Middle Name"
                                type="text"
                                name="middleName"
                                value={formData.middleName}
                                onChange={handleChange}
                                placeholder="Enter your middle name"
                                maxLength={15}
                                required
                                errorMessage={errors.middleName}
                            />
                        </div>
                        <Input
                            label="Last Name"
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Enter your last name"
                            required
                            maxLength={15}
                            errorMessage={errors.lastName}
                        />
                        <SelectInput
                            label="Gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleSelectChange}
                            placeholder="Select your gender"
                            required
                            options={[
                                {value: 'male', label: 'Male'},
                                {value: 'female', label: 'Female'},
                            ]}
                            errorMessage={errors.gender}
                        />
                        <Input
                            label="Place of Birth"
                            type="text"
                            name="placeOfBirth"
                            value={formData.placeOfBirth}
                            onChange={handleChange}
                            placeholder="Enter your place of birth"
                            maxLength={50}
                            required
                            errorMessage={errors.placeOfBirth}
                        />
                        <DatePicker
                            label="Date of Birth"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            required
                            min="1960-01-01"
                            max={new Date().toISOString().split('T')[0]}
                            errorMessage={errors.dateOfBirth}
                        />
                    </div>

                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Address Information</h2>

                        <Input
                            label="Street"
                            type="text"
                            name="street"
                            value={formData.street}
                            onChange={handleChange}
                            placeholder="Enter your street"
                            maxLength={200}
                            required
                            errorMessage={errors.street}
                        />
                        <Input
                            label="City"
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="Enter your city"
                            maxLength={50}
                            required
                            errorMessage={errors.city}
                        />
                        <Input
                            label="State"
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            placeholder="Enter your state"
                            maxLength={100}
                            required
                            errorMessage={errors.state}
                        />
                        <Input
                            label="Country"
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            placeholder="Enter your country"
                            maxLength={50}
                            required
                            errorMessage={errors.country}
                        />
                    </div>

                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Academic Records</h2>
                        <AcademicRecordsForm records={academicRecords} onChange={setAcademicRecords} errors={errors}/>
                    </div>

                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Work Experience</h2>
                        <WorkExperienceForm records={workExperiences} onChange={setWorkExperiences} errors={errors}/>
                    </div>

                    <TextArea
                        label="Bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleTextAreaChange}
                        placeholder="Tell us about yourself"
                        maxLength={500}
                    />

                    <ActionButton
                        type="submit"
                        className={styles.button}
                        onClick={handleSubmit}
                        disabled={loading.submit}
                    >
                        {loading.submit ? "Submitting..." : "Submit"}
                    </ActionButton>
                </form>
            }
            {modal.show && (
                <AlertModal
                    title={modal.title}
                    message={modal.message}
                    error={modal.error}
                    onConfirm={() => setModal(prev => ({...prev, show: false}))}
                    onClose={() => setModal(prev => ({...prev, show: false}))}
                />
            )}
        </div>
    )
}

export default EditProfile;
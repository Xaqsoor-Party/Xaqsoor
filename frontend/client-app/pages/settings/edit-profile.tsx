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
import {useLanguage} from "@/context/LanguageContext";
import {getTranslations} from "@/translations";

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
    const {language} = useLanguage();
    const t = getTranslations(language, "settingsPage").editProfile;
    const {getUserProfile, updateUserProfile} = useUserProfileApi();
    const {user, setUser} = useAuthentication();

    const showAlert = (title: string, message: string, error = false) => {
        setModal({
            show: true,
            title,
            message,
            error,
        });
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return '';
        return date.toISOString().split('T')[0];
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
                        dateOfBirth: profileData.userData.dateOfBirth
                            ? formatDate(profileData.userData.dateOfBirth)
                            : '',
                        bio: profileData.userData.bio || '',
                        street: profileData.userData.street || '',
                        city: profileData.userData.city || '',
                        state: profileData.userData.state || '',
                        country: profileData.userData.country || ''
                    });
                    setAcademicRecords(profileData.academicRecords || []);
                    setWorkExperiences(profileData.workExperiences || []);
                } else {
                    showAlert(t.alerts.updateErrorMessage, response.message || t.alerts.fetchErrorMessage, true);
                }
            } catch (error) {
                showAlert(t.alerts.updateErrorMessage, extractErrorMessage(error, t.alerts.updateErrorMessage), true);
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
            showAlert(t.alerts.validationTitle, t.alerts.validationMessage, true);
            setLoading(prev => ({...prev, submit: false}));
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
                showAlert(t.alerts.updateSuccessTitle, t.alerts.updateSuccessMessage, false);
                setUser({
                    ...user,
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
                });
            } else {
                showAlert(t.alerts.updateErrorMessage, response.message || t.alerts.updateErrorMessage, true);
            }
        } catch (error) {
            showAlert("Error", extractErrorMessage(error, t.alerts.genericErrorMessage), true);
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
            <h1 className={styles.pageTitle}>{t.title}</h1>
            <p className={styles.pageSubtitle}>{t.subtitle}</p>
            {loading.profile ? (
                    <div className={styles.loadingContainer}>
                        <SpinLoading size={50}/>
                        <p>{t.loading}</p>
                    </div>
                ) :
                <form>
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>{t.sections.personal}</h2>
                        <div className={styles.row}>
                            <Input
                                label={t.fields.firstName.label}
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder={t.fields.firstName.placeholder}
                                required
                                maxLength={15}
                                errorMessage={errors.firstName}
                            />
                            <Input
                                label={t.fields.middleName.label}
                                type="text"
                                name="middleName"
                                value={formData.middleName}
                                onChange={handleChange}
                                placeholder={t.fields.middleName.placeholder}
                                maxLength={15}
                                required
                                errorMessage={errors.middleName}
                            />
                        </div>
                        <Input
                            label={t.fields.lastName.label}
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder={t.fields.lastName.placeholder}
                            required
                            maxLength={15}
                            errorMessage={errors.lastName}
                        />
                        <SelectInput
                            label={t.fields.gender.label}
                            name="gender"
                            value={formData.gender}
                            onChange={handleSelectChange}
                            placeholder={t.fields.gender.placeholder}
                            required
                            options={Object.entries(t.fields.gender.options).map(([value, label]) => ({value, label}))}
                            errorMessage={errors.gender}
                        />
                        <Input
                            label={t.fields.placeOfBirth.label}
                            type="text"
                            name="placeOfBirth"
                            value={formData.placeOfBirth}
                            onChange={handleChange}
                            placeholder={t.fields.placeOfBirth.placeholder}
                            maxLength={50}
                            required
                            errorMessage={errors.placeOfBirth}
                        />
                        <DatePicker
                            label={t.fields.dateOfBirth.label}
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
                        <h2 className={styles.sectionTitle}>{t.sections.address}</h2>

                        <Input
                            label={t.fields.street.label}
                            type="text"
                            name="street"
                            value={formData.street}
                            onChange={handleChange}
                            placeholder={t.fields.street.placeholder}
                            maxLength={200}
                            required
                            errorMessage={errors.street}
                        />
                        <Input
                            label={t.fields.city.label}
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder={t.fields.city.placeholder}
                            maxLength={50}
                            required
                            errorMessage={errors.city}
                        />
                        <Input
                            label={t.fields.state.label}
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            placeholder={t.fields.state.placeholder}
                            maxLength={100}
                            required
                            errorMessage={errors.state}
                        />
                        <Input
                            label={t.fields.country.label}
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            placeholder={t.fields.country.placeholder}
                            maxLength={50}
                            required
                            errorMessage={errors.country}
                        />
                    </div>

                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>{t.sections.academic}</h2>
                        <AcademicRecordsForm records={academicRecords} onChange={setAcademicRecords} errors={errors}/>
                    </div>

                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>{t.sections.work}</h2>
                        <WorkExperienceForm records={workExperiences} onChange={setWorkExperiences} errors={errors}/>
                    </div>

                    <TextArea
                        label={t.fields.bio.label}
                        name="bio"
                        value={formData.bio}
                        onChange={handleTextAreaChange}
                        placeholder={t.fields.bio.placeholder}
                        maxLength={500}
                    />

                    <ActionButton
                        type="submit"
                        className={styles.button}
                        onClick={handleSubmit}
                        disabled={loading.submit}
                    >
                        {loading.submit ? t.buttons.submitting : t.buttons.submit}
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
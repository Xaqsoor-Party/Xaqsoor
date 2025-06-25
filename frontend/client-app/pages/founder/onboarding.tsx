import useFounderApi from "@/api/hooks/useFounderApi";
import React, {useState} from "react";
import {DocumentType, FounderFormData} from "@/types/FounderFormData";
import Input from "@/components/common/Input/Input";
import DatePicker from "@/components/common/DatePicker/DatePicker";
import SelectInput from "@/components/common/SelectInput/SelectInput";
import FlagSelect from "@/components/FlagsSelectInput/FlagSelect";
import {countryMap} from "@/util/Countries";
import ProfileImageUpload from "@/components/ProfileImageUpload/ProfileImageUpload";
import SignaturePad from "@/components/SignaturePad/SignaturePad";
import DocumentFormSection from "@/components/DocumentFormSection/DocumentFormSection";
import AcademicRecordsForm from "@/components/settings/AcademicRecordsForm/AcademicRecordsForm";
import WorkExperienceForm from "@/components/settings/WorkExperienceForm/WorkExperienceForm";
import Checkbox from "@/components/common/Checkbox/Checkbox";
import Footer from "@/components/Layout/Footer/Footer";
import Head from "next/head";
import Image from "next/image";
import LanguageSwitcher from "@/components/common/LanguageSwitcher/LanguageSwitcher";
import ActionButton from "@/components/common/ActionButton/ActionButton";
import {validateFounderFormData} from "@/util/validateProfile";
import styles from '@/styles/OnboardingForm.module.css'
import AlertModal from "@/components/common/AlertModal/AlertModal";
import {getOperator} from "@/util/phoneUtils";
import {extractErrorMessage} from "@/util/extractErrorMessage";
import {useLanguage} from "@/context/LanguageContext";
import {getTranslations} from "@/translations";

const Onboarding = () => {
    const {submitFounderProfile} = useFounderApi();
    const [uploadedFile, setUploadedFile] = useState<{ key: string; url: string } | null>(null);
    const [modal, setModal] = useState({
        show: false,
        title: '',
        message: '',
        error: false,
    });

    const [formData, setFormData] = useState<FounderFormData>({
        firstName: '',
        middleName: '',
        lastName: '',
        gender: '',
        placeOfBirth: '',
        dateOfBirth: '',
        email: '',
        phone: '',
        networkOperator: '',
        signatureImageBase64: '',
        profileImageKey: '',
        city: '',
        country: '',
        street: '',
        state: '',
        documents: [{
            documentType: DocumentType.PASSPORT,
            fileStorageKey: '',
            country: '',
            documentNumber: "",
            issuedAt: "",
            expiresAt: "",
        }],
        workExperienceRequestList: [
            {
                jobTitle: '',
                companyName: '',
                location: '',
                startDate: '',
                endDate: '',
                currentlyWorking: false,
                description: '',
            },
        ],
        academicRecordRequestList: [{
            institutionName: '',
            degree: '',
            fieldOfStudy: '',
            level: '',
            location: '',
            currentlyStudying: false,
            startDate: '',
            endDate: '',
        }],
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [countryCode, setCountryCode] = useState("");
    const [agreedToConstitution, setAgreedToConstitution] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({...prev, dateOfBirth: e.target.value}));
    };

    const showAlert = (title: string, message: string, error = false) => {
        setModal({
            show: true,
            title,
            message,
            error,
        });
    };

    const {language} = useLanguage();
    const t = getTranslations(language, 'founderPages').founderOnboarding;

    const handleSubmit = async () => {
        setErrors({});
        // @ts-expect-error - Temporary ignore due to mismatched type imports
        const errors = validateFounderFormData(formData);

        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            showAlert(t.alerts.validationTitle, t.alerts.validationMessage, true);
            return;
        }
        const phoneInfo = getOperator(formData.phone);
        if (!phoneInfo.isValid) {
            setErrors(prev => ({ ...prev, phone: t.alerts.invalidPhoneNumberMessage }));
            showAlert(t.alerts.invalidPhoneNumberTitle,  t.alerts.invalidPhoneNumberMessage, true);
            return;
        }
        const updatedFormData = {
            ...formData,
            phone: phoneInfo.normalizedNumber ?? formData.phone,
            networkOperator: phoneInfo.operator,
        };

        setFormData(updatedFormData);

        try {
            setIsSubmitting(true);
            const response = await submitFounderProfile(updatedFormData);
            console.log(response);
            if (response.code === 200) {
                showAlert(t.alerts.submitSuccessTitle, t.alerts.submitSuccessMessage, false);
            } else {
                showAlert(t.alerts.submitErrorTitle, response.message || t.alerts.submitErrorMessage, true);
            }
        } catch (error) {
            showAlert(t.alerts.submitErrorTitle, extractErrorMessage(error,t.alerts.submitErrorMessage), true);
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleCountryChange = (code: string) => {
        const countryName = countryMap[code] || "";
        setFormData((prevState) => ({
            ...prevState,
            country: countryName,
        }));
        setCountryCode(code);
    };

    const handleUpload = (result: { key: string; url: string }) => {
        setFormData(prev => ({
            ...prev,
            profileImageKey: result.key,
        }));
        setUploadedFile(result);
    };

    const handleSignatureChange = (dataUrl: string) => {
        setFormData(prev => ({
            ...prev,
            signatureImageBase64: dataUrl,
        }));
    };

    const today = new Date().toISOString().split("T")[0];

    return (
        <>
            <Head>
                <title>Join as a Founding Member • Xaqsoor Organization</title>
            </Head>

            <div className={styles.onboardingContainer}>
                <div className={styles.topBar}>
                    <div className={styles.logo}>
                        <Image src={"/images/Xaqsoor_Logo_English_1.png"} alt={"logo"} width={280} height={60}/>
                    </div>

                    <div className={styles.languageSwitcher}>
                        <LanguageSwitcher/>
                    </div>
                </div>

                <div className={styles.header}>
                    <h1 className={styles.formTitle}>{t.title}</h1>
                    <p className={styles.formSubtitle}>
                        {t.subtitle}
                    </p>
                </div>

                <form className={styles.form}>
                    <div className={styles.personalInfoSection}>
                        <h2 className={styles.sectionHeading}>{t.sections.personal}</h2>

                        {errors.signatureImageBase64 && (
                            <div className={styles.errorMessage}>
                                {errors.signatureImageBase64}
                            </div>
                        )}

                        <div className={styles.profileAndNameSection}>
                            <ProfileImageUpload
                                onUpload={handleUpload}
                                uploadedImageUrl={uploadedFile?.url}
                                photoErrors={errors.profileImageKey}
                                required={true}
                            />

                            <div className={styles.nameAndGenderSection}>
                                <div className={styles.formRow}>
                                    <Input
                                        label={t.fields.firstName.label}
                                        name="firstName"
                                        type="text"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                        errorMessage={errors.firstName}
                                        maxLength={15}
                                        placeholder={t.fields.firstName.placeholder}
                                    />
                                    <Input
                                        label={t.fields.middleName.label}
                                        name="middleName"
                                        type="text"
                                        value={formData.middleName}
                                        onChange={handleChange}
                                        required
                                        errorMessage={errors.middleName}
                                        maxLength={15}
                                        placeholder={t.fields.middleName.placeholder}
                                    />
                                </div>

                                <div className={styles.formRow}>
                                    <Input
                                        label={t.fields.lastName.label}
                                        name="lastName"
                                        type="text"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                        errorMessage={errors.lastName}
                                        maxLength={15}
                                        placeholder={t.fields.lastName.placeholder}
                                    />
                                    <SelectInput
                                        label={t.fields.gender.label}
                                        name="gender"
                                        value={formData.gender}
                                        onChange={(e) => setFormData(prev => ({...prev, gender: e.target.value}))}
                                        required
                                        options={t.fields.gender.options}
                                        placeholder={t.fields.gender.placeholder}
                                        errorMessage={errors.gender}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <Input
                                label={t.fields.placeOfBirth.label}
                                name="placeOfBirth"
                                type="text"
                                value={formData.placeOfBirth}
                                onChange={handleChange}
                                required
                                errorMessage={errors.placeOfBirth}
                                placeholder={t.fields.placeOfBirth.placeholder}
                                maxLength={50}
                            />
                            <DatePicker
                                label={t.fields.dateOfBirth.label}
                                value={formData.dateOfBirth}
                                onChange={handleDateChange}
                                required
                                max={today}
                                errorMessage={errors.dateOfBirth}
                            />
                        </div>

                        <div className={styles.formRow}>
                            <Input
                                label={t.fields.email.label}
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                errorMessage={errors.email}
                                placeholder={t.fields.email.placeholder}
                                maxLength={255}
                            />
                            <Input
                                label={t.fields.phone.label}
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                errorMessage={errors.phone}
                                placeholder={t.fields.phone.placeholder}
                                maxLength={15}
                            />
                        </div>
                    </div>

                    <div className={styles.addressSection}>
                        <h3 className={styles.sectionTitle}>{t.sections.address}</h3>
                        <div className={styles.formRow}>
                            <FlagSelect
                                label={t.fields.country.label}
                                value={countryCode}
                                onChange={handleCountryChange}
                                options={Object.entries(countryMap).map(([code, name]) => ({value: code, label: name}))}
                                placeholder={t.fields.country.placeholder}
                                required
                                errorMessage={errors.country}
                            />
                            <Input
                                label={t.fields.city.label}
                                name="city"
                                type="text"
                                value={formData.city}
                                onChange={handleChange}
                                required
                                errorMessage={errors.city}
                                maxLength={100}
                                placeholder={t.fields.city.placeholder}
                            />
                        </div>

                        <div className={styles.formRow}>
                            <Input
                                label={t.fields.state.label}
                                name="state"
                                type="text"
                                value={formData.state}
                                onChange={handleChange}
                                required
                                errorMessage={errors.state}
                                placeholder={t.fields.state.placeholder}
                                maxLength={100}
                            />

                            <Input
                                label={t.fields.street.label}
                                name="street"
                                type="text"
                                value={formData.street}
                                onChange={handleChange}
                                required
                                errorMessage={errors.street}
                                maxLength={200}
                                placeholder={t.fields.street.placeholder}
                            />
                        </div>
                    </div>

                    <div className={styles.documentSection}>
                        <h3 className={styles.sectionTitle}>{t.sections.documents.title}</h3>
                        <p className={styles.sectionDescription}>
                            {t.sections.documents.subtitle}
                        </p>

                        <DocumentFormSection
                            documents={formData.documents}
                            onChange={(newDocs) => setFormData(prev => ({...prev, documents: newDocs}))}
                            errors={errors}
                        />
                    </div>

                    <div className={styles.academicSection}>
                        <h3 className={styles.sectionTitle}>{t.sections.academic.title}</h3>
                        <p className={styles.sectionDescription}>{t.sections.academic.subtitle}</p>
                        <AcademicRecordsForm
                            // @ts-expect-error - Temporary ignore due to mismatched type imports
                            records={formData.academicRecordRequestList}
                            onChange={(newRecords) =>
                                setFormData((prev) => ({...prev, academicRecordRequestList: newRecords}))
                            }
                            errors={errors}
                            hideRemoveIfSingle={true}
                        />
                    </div>

                    <div className={styles.workExperienceSection}>
                        <h3 className={styles.sectionTitle}>{t.sections.work.title}</h3>
                        <p className={styles.sectionDescription}>
                            {t.sections.work.subtitle}
                        </p>

                        <WorkExperienceForm
                            records={formData.workExperienceRequestList}
                            onChange={(newRecords) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    workExperienceRequestList: newRecords,
                                }))
                            }
                            errors={errors}
                            hideRemoveIfSingle={true}
                        />
                    </div>

                    <div className={styles.agreementSection}>
                        <div className={styles.agreementCheckbox}>
                            <Checkbox
                                label={t.fields.constitutionAgreement}
                                checked={agreedToConstitution}
                                onChange={(e) => setAgreedToConstitution(e.target.checked)}
                                required
                                name="agreeToConstitution"
                            />
                        </div>
                        <SignaturePad onChange={handleSignatureChange} initialSignature={formData.signatureImageBase64}/>
                    </div>

                    <div className={styles.submitButtonContainer}>
                        <ActionButton
                            type="submit"
                            className={styles.submitButton}
                            onClick={handleSubmit}
                            disabled={isSubmitting || !agreedToConstitution}
                        >
                            {isSubmitting ? t.buttons.submitting : t.buttons.submit}
                        </ActionButton>
                    </div>
                </form>
            </div>
            {modal.show && (
                <AlertModal
                    title={modal.title}
                    message={modal.message}
                    error={modal.error}
                    onConfirm={() => setModal(prev => ({...prev, show: false}))}
                    onClose={() => setModal(prev => ({...prev, show: false}))}
                />
            )}
            <Footer/>
        </>
    )
}
export default Onboarding;
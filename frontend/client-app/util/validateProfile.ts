import {AcademicRecordRequest, WorkExperienceRequest} from "@/types/user";
import {UserDocumentRequestDto} from "@/types/FounderFormData";

interface FormData {
    firstName: string;
    middleName: string;
    lastName: string;
    gender: string;
    placeOfBirth: string;
    dateOfBirth: string;
    street: string;
    city: string;
    state: string;
    country: string;
}

interface FoundersFormData extends FormData {
    email: string;
    phone: string;
    signatureImageBase64: string;
    profileImageKey: string;
    documents: UserDocumentRequestDto[];
    workExperienceRequestList: WorkExperienceRequest[];
    academicRecordRequestList: AcademicRecordRequest[];
}

export const validateFormData = (
    formData: FormData,
    academicRecords: AcademicRecordRequest[],
    workExperiences: WorkExperienceRequest[]
) => {
    const newErrors: { [key: string]: string } = {};
    Object.assign(newErrors, validateBasicFormFields(formData));
    Object.assign(newErrors, validateAcademicRecords(academicRecords));
    Object.assign(newErrors, validateWorkExperiences(workExperiences));
    return newErrors;
};

export const validateFounderFormData = (
    formData: FoundersFormData,
) => {

    const newErrors: { [key: string]: string } = {};
    Object.assign(newErrors, validateBasicFormFields(formData,true));

    if (!formData.email.trim()) {
        newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Invalid email format";
    }

    // Validate phone
    if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required";
    }

    // Validate signature image
    if (!formData.signatureImageBase64.trim()) {
        newErrors.signatureImageBase64 = "Signature is required";
    }

    // Validate profile image
    if (!formData.profileImageKey.trim()) {
        newErrors.profileImageKey = "Profile image is required";
    }

    Object.assign(newErrors, validateAcademicRecords(formData.academicRecordRequestList));
    Object.assign(newErrors, validateWorkExperiences(formData.workExperienceRequestList));
    Object.assign(newErrors, validateDocuments(formData.documents));
    return newErrors;
}

const validateBasicFormFields = (
    formData: FormData,
    skipAddressValidation: boolean = false
): { [key: string]: string, } => {
    const errors: { [key: string]: string } = {};

    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (!formData.middleName.trim()) errors.middleName = "Middle name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required";
    if (!formData.gender) errors.gender = "Gender is required";
    if (!formData.placeOfBirth.trim()) errors.placeOfBirth = "Place of birth is required";
    if (!formData.dateOfBirth) errors.dateOfBirth = "Date of birth is required";

    if (!skipAddressValidation) {
        if (!formData.street.trim()) errors.street = "Street is required";
        if (!formData.state.trim()) errors.state = "State is required";
    }

    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.country.trim()) errors.country = "Country is required";

    return errors;
};

const validateAcademicRecords = (academicRecords: AcademicRecordRequest[]) => {
    const errors: { [key: string]: string } = {};

    academicRecords.forEach((record, index) => {
        if (!record.institutionName.trim()) {
            errors[`academicRecords.${index}.institutionName`] = "Institution name is required";
        }
        if (!record.fieldOfStudy.trim()) {
            errors[`academicRecords.${index}.fieldOfStudy`] = "Field of study is required";
        }
        if (!record.level.trim()) {
            errors[`academicRecords.${index}.level`] = "Education level is required";
        }
        if (!record.location.trim()) {
            errors[`academicRecords.${index}.location`] = "Location is required";
        }
        if (!record.startDate) {
            errors[`academicRecords.${index}.startDate`] = "Start date is required";
        }
        if (!record.currentlyStudying && !record.endDate) {
            errors[`academicRecords.${index}.endDate`] = "End date is required if not currently studying";
        }
    });

    return errors;
};

const validateWorkExperiences = (workExperiences: WorkExperienceRequest[]) => {
    const errors: { [key: string]: string } = {};

    workExperiences.forEach((record, index) => {
        if (!record.jobTitle.trim()) {
            errors[`workExperiences.${index}.jobTitle`] = "Job title is required";
        }
        if (!record.companyName.trim()) {
            errors[`workExperiences.${index}.companyName`] = "Company name is required";
        }
        if (!record.location.trim()) {
            errors[`workExperiences.${index}.location`] = "Location is required";
        }
        if (!record.startDate) {
            errors[`workExperiences.${index}.startDate`] = "Start date is required";
        }
        if (!record.currentlyWorking && !record.endDate) {
            errors[`workExperiences.${index}.endDate`] = "End date is required if not currently working";
        }
    });

    return errors;
};

const validateDocuments = (documents: UserDocumentRequestDto[]): { [key: string]: string } => {
    const errors: { [key: string]: string } = {};

    documents.forEach((doc, index) => {
        if (!doc.documentType) {
            errors[`documents.${index}.documentType`] = "Document type is required";
        }
        if (!doc.fileStorageKey.trim()) {
            errors[`documents.${index}.fileStorageKey`] = "File is required";
        }
        if (!doc.country.trim()) {
            errors[`documents.${index}.country`] = "Country is required";
        }
        if (!doc.documentNumber.trim()) {
            errors[`documents.${index}.documentNumber`] = "Document number is required";
        }
        if (!doc.issuedAt) {
            errors[`documents.${index}.issuedAt`] = "Issued date is required";
        }
        // if (!doc.expiresAt) {
        //     errors[`documents.${index}.expiresAt`] = "Expiry date is required";
        // }
    });

    return errors;
};

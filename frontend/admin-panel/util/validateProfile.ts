import { AcademicRecordRequest, WorkExperienceRequest } from "@/types/user";

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

export const validateFormData = (
    formData: FormData,
    academicRecords: AcademicRecordRequest[],
    workExperiences: WorkExperienceRequest[]
) => {
    const newErrors: { [key: string]: string } = {};

    // Basic fields
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.middleName.trim()) newErrors.middleName = "Middle name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.placeOfBirth.trim()) newErrors.placeOfBirth = "Place of birth is required";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.street.trim()) newErrors.street = "Street is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.country.trim()) newErrors.country = "Country is required";

    // Academic records validation (only if array is not empty)
    if (academicRecords.length > 0) {
        academicRecords.forEach((record, index) => {
            if (!record.institutionName.trim()) {
                newErrors[`academicRecords.${index}.institutionName`] = "Institution name is required";
            }
            if (!record.fieldOfStudy.trim()) {
                newErrors[`academicRecords.${index}.fieldOfStudy`] = "Field of study is required";
            }
            if (!record.level.trim()) {
                newErrors[`academicRecords.${index}.level`] = "Education level is required";
            }
            if (!record.location.trim()) {
                newErrors[`academicRecords.${index}.location`] = "Location is required";
            }
            if (!record.startDate) {
                newErrors[`academicRecords.${index}.startDate`] = "Start date is required";
            }
            if (!record.currentlyStudying && !record.endDate) {
                newErrors[`academicRecords.${index}.endDate`] = "End date is required if not currently studying";
            }
        });
    }

    // Work experiences validation (only if array is not empty)
    if (workExperiences.length > 0) {
        workExperiences.forEach((record, index) => {
            if (!record.jobTitle.trim()) {
                newErrors[`workExperiences.${index}.jobTitle`] = "Job title is required";
            }
            if (!record.companyName.trim()) {
                newErrors[`workExperiences.${index}.companyName`] = "Company name is required";
            }
            if (!record.location.trim()) {
                newErrors[`workExperiences.${index}.location`] = "Location is required";
            }
            if (!record.startDate) {
                newErrors[`workExperiences.${index}.startDate`] = "Start date is required";
            }
            if (!record.currentlyWorking && !record.endDate) {
                newErrors[`workExperiences.${index}.endDate`] = "End date is required if not currently working";
            }
        });
    }

    return newErrors;
};

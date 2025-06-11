export interface User {
    id:number;
    createdBy: number;
    modifiedBy?: number;
    userId: string;
    firstName: string;
    middleName: string;
    lastName: string;
    gender: string;
    placeOfBirth?: string;
    dateOfBirth?: string;
    status: string;
    role: string;
    authorities: string;
    email: string;
    phone: string;
    bio?: string;
    lastLogin?: string;
    profileImageUrl?: string;
    createdDate: string;
    modifiedDate?: string;
    mfaQrCodeImageUrl?: string;

    street?: string;
    city?: string;
    state?: string;
    country?: string;

    emailVerified?: boolean;
    mfaEnabled?: boolean;
    accountNonExpired?: boolean;
    accountNonLocked?: boolean;
    enabled?: boolean;
}

export interface UserUpdateDTO {
    id: number;
    firstName: string;
    middleName: string;
    lastName: string;
    gender: string;
    placeOfBirth?: string;
    dateOfBirth?: string; // ISO string
    bio?: string;
    street?: string;
    city?: string;
    state?: string;
    country?: string;
}


export enum EducationLevel {
    HIGH_SCHOOL = "High school",
    DIPLOMA = "Diploma",
    BACHELORS = "Bachelor's",
    MASTERS = "Master's",
    PHD = "PhD",
    OTHER = "Other"
}


export interface AcademicRecordRequest {
    id?: number;
    institutionName: string;
    degree?: string;
    fieldOfStudy: string;
    level: EducationLevel;
    location: string;
    currentlyStudying: boolean;
    startDate: string; // ISO date string
    endDate?: string;  // ISO date string
}

export interface WorkExperienceRequest {
    id?: number;
    jobTitle: string;
    companyName: string;
    location: string;
    startDate: string; // ISO date string
    endDate?: string;  // ISO date string
    currentlyWorking: boolean;
    description?: string;
}

export interface UserProfileUpdateRequest {
    userUpdateDTO: UserUpdateDTO;
    academicRecords: AcademicRecordRequest[];
    workExperiences: WorkExperienceRequest[];
}

export interface UserProfileResponse {
    userData: UserUpdateDTO;
    academicRecords: AcademicRecordRequest[];
    workExperiences: WorkExperienceRequest[];
}

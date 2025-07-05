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
    membershipLevel: string ;
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
    signatureImageUrl?: string;

    street?: string;
    district?:string;
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
    userData: User;
    academicRecords: AcademicRecordRequest[];
    workExperiences: WorkExperienceRequest[];
    userDocuments?: UserDocument[];
}

export interface UserCardDTO {
    userId: number;
    fullName: string;
    email: string;
    phone: string;
    profileImageUrl: string | null;
    membershipLevel: string;
    status: string;
}

export interface UserCardListDto {
    totalItems: number;
    pageNumber: number;
    pageSize: number;
    users: UserCardDTO[];
}

export enum MembershipLevel {
    NEW_MEMBER = "NEW_MEMBER",
    SUPPORTER = "SUPPORTER",
    FOUNDER = "FOUNDER",
    TECH_TEAM = "TECH_TEAM",
    PERSONNEL = "PERSONNEL",
}

export enum Status {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    SUSPENDED = "SUSPENDED",
    PENDING = "PENDING",
}

export enum Roles {
    ADMIN = "ADMIN",
    SUPER_ADMIN = "SUPER_ADMIN",
    MEMBER = "MEMBER",
}

export type OrderBy =
    | "createdDateAsc"
    | "createdDateDesc"
    | "firstNameAsc"
    | "firstNameDesc"
    | "emailAsc"
    | "emailDesc"
    | "lastLoginAsc"
    | "lastLoginDesc";


export interface UserSearchParams {
    searchTerm?: string;
    statusFilter?: Status;
    roleFilter?: string;
    genderFilter?: string;
    membershipLevelFilter?: MembershipLevel;
    orderBy?: OrderBy;
    pageNumber?: number;
    pageSize?: number;
}

export interface UserDocument {
    id: number;
    documentType: string;
    fileUrl: string;
    verified: boolean;
    rejectionReason: string | null;
    country: string;
    documentNumber: string;
    issuedAt: string;
    expiresAt: string | null;
}
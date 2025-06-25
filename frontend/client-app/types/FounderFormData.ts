import {AcademicRecordRequest} from "@/types/academic";
import {WorkExperienceRequest} from "@/types/work";

export interface FounderFormData {
    firstName: string;
    middleName: string;
    lastName: string;
    gender: string;
    placeOfBirth: string;
    dateOfBirth: string; // Use ISO format: YYYY-MM-DD
    email: string;
    phone: string;
    networkOperator: string;
    signatureImageBase64: string;
    profileImageKey: string;
    city: string;
    country: string;
    street: string;
    state: string;

    documents: UserDocumentRequestDto[];
    workExperienceRequestList: WorkExperienceRequest[];
    academicRecordRequestList: AcademicRecordRequest[];
}

export interface UserDocumentRequestDto {
    documentType: DocumentType;
    fileStorageKey: string;
    country: string;
    documentNumber: string;
    issuedAt: string;  // Format: YYYY-MM-DD
    expiresAt: string; // Format: YYYY-MM-DD
}

export enum DocumentType {
    PASSPORT = "PASSPORT",
    NATIONAL_ID = "NATIONAL_ID",
}

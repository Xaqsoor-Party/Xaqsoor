export interface User {
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

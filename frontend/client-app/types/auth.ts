import {User} from "@/types/user";

export interface UserCreateRequest {
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    phone: string;
    networkProvider: string;
    gender: string;
    roleName?: string;
    country?: string;
    state?: string;
    city?: string;
    district?: string;
}

export interface ApiResponse<T> {
    data?: T;
    message: string;
    status?: number;
    time: string;
    path: string;
    code: number;
    exception?: string;
}

export interface UserLoginRequest {
    email: string;
    password: string;
}

export interface AuthResponseData {
    loginStatus: string;
    mfaQRCodeImageUri: string | null;
    securityToken: string | null;
    accessToken: string | null;
    userDTO: User | null;
}

export interface MfaVerificationRequest {
    mfaToken: string;
    verificationCode: string; // 6-digit string
}

export interface RefreshTokenResponseData {
    accessToken: string;
    userDTO: User;
}

export interface UserVerificationResponse {
    email: string;
    fullName: string;
}

export interface SetPasswordRequest {
    key: string;
    password: string;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

export interface InitialMfaVerificationRequest {
    mfaSecret: string;
    verificationCode: string;
}

export interface MfaSetupDetails {
    mfaSecret: string;
    qrCodeImageUri: string;
}
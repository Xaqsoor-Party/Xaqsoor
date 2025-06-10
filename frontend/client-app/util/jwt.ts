export interface JwtPayload {
    mfa_type?: string;
    sub?: string;
    iat?: number;
    exp?: number;
    [key: string]: any;
}

/**
 * Decodes a JWT token safely.
 * Returns the payload object or null if invalid.
 */
export function decodeJwt(token: string): JwtPayload | null {
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        );
        return JSON.parse(jsonPayload);
    } catch {
        return null;
    }
}

/**
 * Validates an MFA JWT token.
 * Returns true if token is valid (not expired & correct type), false otherwise.
 */
export function isValidMfaToken(token: string): boolean {
    const payload = decodeJwt(token);

    if (!payload) return false;

    const currentTime = Math.floor(Date.now() / 1000);

    if (payload.mfa_type !== "mfa_verify") return false;

    return !(!payload.exp || payload.exp < currentTime);
}

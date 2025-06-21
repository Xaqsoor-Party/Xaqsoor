type PhoneNumberInfo = {
    operator: string;
    normalizedNumber: string | null;
    isValid: boolean;
};

const SOMALIA_COUNTRY_CODE = "+252";

const VALID_PREFIXES: Record<string, string> = {
    "61": "Hormuud",
    "77": "Hormuud",
    "62": "Somtel",
    "65": "Somtel",
    "66": "Somtel",
    "63": "Telesom",
    "64": "SomLink",
    "68": "SomNet",
    "69": "NationLink",
    "71": "Amtel",
    "90": "Golis",
};

export function getOperator(phoneNumber: string): PhoneNumberInfo {
    if (!phoneNumber || phoneNumber.trim().length < 9) {
        return {
            operator: "Unknown",
            normalizedNumber: phoneNumber,
            isValid: false,
        };
    }

    const normalized = normalizePhoneNumber(phoneNumber);

    if (!normalized) {
        return {
            operator: "Unknown",
            normalizedNumber: null,
            isValid: false,
        };
    }

    return validatePhoneNumber(normalized);
}

function normalizePhoneNumber(phoneNumber: string): string | null {
    let normalized = phoneNumber.replace(/\D/g, '');

    if (normalized.startsWith("00252")) {
        normalized = normalized.slice(5);
    } else if (normalized.startsWith("252")) {
        normalized = normalized.slice(3);
    } else if (normalized.startsWith("0")) {
        normalized = normalized.slice(1);
    }

    if (normalized.length !== 9) {
        return null;
    }

    return SOMALIA_COUNTRY_CODE + normalized;
}

function validatePhoneNumber(normalized: string): PhoneNumberInfo {
    if (normalized.length !== 13) {
        return {
            operator: "Unknown",
            normalizedNumber: normalized,
            isValid: false,
        };
    }

    const localNumber = normalized.slice(4); // Strip "+252"

    for (const [prefix, operator] of Object.entries(VALID_PREFIXES)) {
        if (localNumber.startsWith(prefix)) {
            return {
                operator,
                normalizedNumber: normalized,
                isValid: true,
            };
        }
    }

    return {
        operator: "Unknown",
        normalizedNumber: normalized,
        isValid: false,
    };
}

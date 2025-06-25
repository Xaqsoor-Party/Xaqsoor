import { parsePhoneNumberWithError } from 'libphonenumber-js';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';

// Register the English locale to get country names
countries.registerLocale(enLocale);

export type PhoneNumberInfo = {
    operator: string;
    normalizedNumber: string | null;
    isValid: boolean;
    countryCode: string | null;
    countryName?: string | null;
};

const SOMALIA_COUNTRY_CODE_ISO = "SO";

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

export function getOperator(phoneNumberString: string): PhoneNumberInfo {
    try {
        const cleaned = phoneNumberString.trim().replace(/\s+/g, '');

        let phoneNumber;
        if (cleaned.startsWith('+') || cleaned.startsWith('00')) {
            const international = cleaned.startsWith('00') ? '+' + cleaned.slice(2) : cleaned;
            phoneNumber = parsePhoneNumberWithError(international);
        } else if (cleaned.length > 10 && /^\d+$/.test(cleaned)) {
            // Likely an international number without +
            phoneNumber = parsePhoneNumberWithError('+' + cleaned);
        } else {
            // Treat as local Somali number
            phoneNumber = parsePhoneNumberWithError(cleaned, SOMALIA_COUNTRY_CODE_ISO);
        }

        const normalizedNumber = phoneNumber.number;
        const isValid = phoneNumber.isValid();
        const countryCode = phoneNumber.country || null;
        const countryName = countryCode ? countries.getName(countryCode, "en", { select: "official" }) : null;

        if (!isValid) {
            return {
                operator: "Unknown",
                normalizedNumber,
                isValid: false,
                countryCode,
                countryName,
            };
        }

        // Handle Somali operator detection
        if (countryCode === SOMALIA_COUNTRY_CODE_ISO) {
            const localNumber = phoneNumber.nationalNumber.toString();

            for (const [prefix, operator] of Object.entries(VALID_PREFIXES)) {
                if (localNumber.startsWith(prefix)) {
                    return {
                        operator,
                        normalizedNumber,
                        isValid: true,
                        countryCode,
                        countryName: "Somalia",
                    };
                }
            }

            return {
                operator: "Unknown (Somalia)",
                normalizedNumber,
                isValid: true,
                countryCode,
                countryName: "Somalia",
            };
        }

        // For valid international numbers
        return {
            operator: countryName ? `International (${countryName})` : "International",
            normalizedNumber,
            isValid: true,
            countryCode,
            countryName,
        };

    } catch (error) {
        return {
            operator: "Unknown",
            normalizedNumber: phoneNumberString,
            isValid: false,
            countryCode: null,
            countryName: null,
        };
    }
}

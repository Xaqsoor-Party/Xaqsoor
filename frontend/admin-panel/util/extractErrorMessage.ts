import { AxiosError } from "axios";

export function extractErrorMessage(error: unknown, defaultMessage: string): string {
    if (error instanceof AxiosError) {
        return error.response?.data?.message || defaultMessage;
    } else if (error instanceof Error) {
        return error.message || defaultMessage;
    }

    return defaultMessage;
}

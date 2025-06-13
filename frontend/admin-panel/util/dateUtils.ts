export const formatDuration = (
    startDateStr: string,
    endDateStr?: string,
    currentlyStudying?: boolean
): string => {
    const parseDate = (dateString: string): Date => {
        const parts = dateString.split(' ');
        if (parts.length === 3) {
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const monthIndex = monthNames.findIndex(
                name => name.toLowerCase() === parts[1].substring(0, 3).toLowerCase()
            );

            if (monthIndex > -1) {
                return new Date(parseInt(parts[2]), monthIndex, parseInt(parts[0]));
            }
        }
        return new Date(dateString); // Fallback
    };

    const startDate = parseDate(startDateStr);
    let durationText: string;

    if (currentlyStudying) {
        durationText = "Present";
    } else if (endDateStr) {
        const endDate = parseDate(endDateStr);
        durationText = `${endDate.getFullYear()}`;
    } else {
        durationText = "End Date N/A";
    }

    const startMonthYear = new Intl.DateTimeFormat('en-US', {
        month: 'long',
        year: 'numeric'
    }).format(startDate);

    return `${startMonthYear} - ${durationText}`;
};


export const formatDateTime = (dateString: string | undefined) => {
    const notAvailableText = "N/A";
    if (!dateString) return notAvailableText;
    try {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        }).format(date);
    } catch {
        return notAvailableText;
    }
};

export const formatDate = (dateString: string | undefined) => {
    const notAvailableText = "N/A";
    if (!dateString) return notAvailableText;
    try {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }).format(date);
    } catch {
        return notAvailableText;
    }
};
export interface SystemHealthDto {
    cpuLoad: number;            // System CPU load
    totalMemory: number;        // Total system memory (in bytes)
    freeMemory: number;         // Free memory (in bytes)
    usedMemory: number;         // Used memory (in bytes)
    uptime: number;             // System uptime (in minutes)
    activeThreads: number;      // Active threads in the JVM
    lastUpdated: string;        // Last updated time
}

export interface TimelineEntry {
    date: string;
    count: number;
}

export interface UserGrowthDto {
    timeline: TimelineEntry[]; // List of TimelineEntry
    percentageChange: number;  // Growth percentage
    comparisonPeriod: string;  // Comparison period label
    lastUpdated: string;       // Last updated time
}

export interface RecentActivityDto {
    userId: number;
    firstName: string;
    profileImageKey: string;
    description: string;
    timestamp: string;
}

export interface RecentActivityListDto {
    activities: RecentActivityDto[];
    pageSize: number;
    pageNumber: number;
    totalItems: number;
}

export interface DashboardSummaryDto {
    totalMembers: number;
    maleCount: number;
    femaleCount: number;
    profileCompletionRate: number;
    lastUpdated: string;
    membershipLevelDistribution: Record<string, number>;
    userStatusDistribution: Record<string, number>;
    newMembersThisMonth: number;
    lockedAccounts: number;
    mfaEnabledUsers: number;
    unverifiedEmails: number;
    loginRestrictedUsers: number;
    roleDistribution: Record<string, number>;
}

export enum Range {
    LAST_24H = 'LAST_24H',
    LAST_7D = 'LAST_7D',
    LAST_30D = 'LAST_30D',
    LAST_90D = 'LAST_90D',
    CUSTOM = 'CUSTOM',
}

export interface TimeRangeRequest {
    range: Range;
    startDate?: string; // For CUSTOM only
    endDate?: string;   // For CUSTOM only
}

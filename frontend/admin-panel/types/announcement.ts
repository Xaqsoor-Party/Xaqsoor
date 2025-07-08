export type AnnouncementStatus = "Active" | "Archived" | "Pending";

export interface AnnouncementDto {
    id?: number;
    title: string;
    content: string;
    status?: AnnouncementStatus;
    announcementDate?: string;  // ISO or formatted date (e.g., "28 June 2025")
}

export interface AnnouncementListDto {
    totalItems: number;
    pageNumber: number;
    pageSize: number;
    announcements: AnnouncementDto[];
}

export interface RecycleItemsResponse<T = unknown> {
    totalItems: number;
    page: number;
    size: number;
    entityType: string;
    items: T[];
}

export interface AnnouncementRecycleDto {
    id: number;
    title: string;
    content: string;
    announcementDate: string;      // formatted "dd MMMM yyyy"
    status: string;
    deletedByUserId: number;
    lastModifiedByName: string;
    deletedDate: string;           // formatted "dd MMMM yyyy"
}

export interface UserRecycleDto {
    userId: number;
    fullName: string;
    email: string;
    phone: string;
    roleName: string;
    status: string;
    deletedByUserId: number;
    lastModifiedByName: string;
    deletedDate: string;           // formatted "dd MMMM yyyy"
}

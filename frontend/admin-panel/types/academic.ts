export interface AcademicRecordRequest {
    institutionName: string;
    degree?: string;
    fieldOfStudy: string;
    level: string;
    location: string;
    currentlyStudying: boolean;
    startDate: string;  // or Date if you're formatting it
    endDate?: string;
}

export interface AcademicRecordDto extends AcademicRecordRequest {
    id: number;
    userId:string;
}

export interface AcademicRecordListDto {
    academicRecords: AcademicRecordDto[];
}

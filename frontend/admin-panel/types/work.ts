export interface WorkExperienceDto {
    id: number;
    jobTitle: string;
    companyName: string;
    location: string;
    startDate: string;
    endDate: string;
    currentlyWorking: boolean;
    description: string;
}

export interface WorkExperienceRequest {
    jobTitle: string;
    companyName: string;
    location: string;
    startDate: string;
    endDate?: string;
    currentlyWorking: boolean;
    description?: string;
}

export interface WorkExperienceListDto {
    workExperiences: WorkExperienceDto[];
}

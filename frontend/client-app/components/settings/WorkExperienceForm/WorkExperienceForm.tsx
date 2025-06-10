import React from 'react';
import Input from '@/components/common/Input/Input';
import DatePicker from '@/components/common/DatePicker/DatePicker';
import ActionButton from '@/components/common/ActionButton/ActionButton';
import Checkbox from '@/components/common/Checkbox/Checkbox';
import TextArea from '@/components/common/TextArea/TextArea';
import styles from './WorkExperienceForm.module.css';
import {WorkExperienceRequest} from "@/types/user";

interface WorkExperienceFormProps {
    records: WorkExperienceRequest[];
    onChange: (newRecords: WorkExperienceRequest[]) => void;
    errors?: { [key: string]: string };
}

const WorkExperienceForm: React.FC<WorkExperienceFormProps> = ({records, onChange,errors}) => {
    const handleRecordChange = (
        index: number,
        field: keyof WorkExperienceRequest,
        value: string | boolean
    ) => {
        const updated = [...records];

        // @ts-ignore
        (updated[index])[field] = value;
        onChange(updated);
    };

    const handleAdd = () => {
        const newRecord: WorkExperienceRequest = {
            jobTitle: '',
            companyName: '',
            location: '',
            startDate: '',
            endDate: '',
            currentlyWorking: false,
            description: '',
        };
        onChange([...records, newRecord]);
    };

    const handleRemove = (index: number) => {
        const updated = records.filter((_, idx) => idx !== index);
        onChange(updated);
    };

    return (
        <div className={styles.workExperienceForm}>
            {records.map((record, idx) => (
                <div key={record.id} className={styles.recordItem}>
                    <div className={styles.recordHeader}>
                        <h3 className={styles.recordTitle}>Work Experience #{idx + 1}</h3>
                        <ActionButton type="button" onClick={() => handleRemove(idx)} className={styles.removeButton}>
                            Remove
                        </ActionButton>
                    </div>

                    <div className={styles.row}>
                        <Input
                            type={"text"}
                            label="Job Title"
                            name="jobTitle"
                            value={record.jobTitle}
                            onChange={(e) => handleRecordChange(idx, 'jobTitle', e.target.value)}
                            placeholder="e.g., Software Engineer"
                            required
                            maxLength={100}
                            errorMessage={errors?.[`workExperiences.${idx}.jobTitle`]}
                        />

                        <Input
                            type={"text"}
                            label="Company Name"
                            name="companyName"
                            value={record.companyName}
                            onChange={(e) => handleRecordChange(idx, 'companyName', e.target.value)}
                            placeholder="e.g., Tech Solutions Inc."
                            required
                            maxLength={120}
                            errorMessage={errors?.[`workExperiences.${idx}.companyName`]}
                        />
                    </div>

                    <Input
                        type={"text"}
                        label="Location"
                        name="location"
                        value={record.location}
                        onChange={(e) => handleRecordChange(idx, 'location', e.target.value)}
                        placeholder="City, Country"
                        required
                        maxLength={100}
                        errorMessage={errors?.[`workExperiences.${idx}.location`]}
                    />

                    <Checkbox
                        label="Currently Working Here"
                        checked={record.currentlyWorking}
                        onChange={(e) => handleRecordChange(idx, 'currentlyWorking', e.target.checked)}
                    />

                    <div className={styles.row}>
                        <DatePicker
                            label="Start Date"
                            name="startDate"
                            value={record.startDate}
                            onChange={(e) => handleRecordChange(idx, 'startDate', e.target.value)}
                            required
                            max={new Date().toISOString().split('T')[0]}
                            min="1960-01-01"
                            errorMessage={errors?.[`workExperiences.${idx}.startDate`]}
                        />
                        {!record.currentlyWorking && (
                            <DatePicker
                                label="End Date"
                                name="endDate"
                                value={record.endDate || null}
                                onChange={(e) => handleRecordChange(idx, 'endDate', e.target.value)}
                                disabled={record.currentlyWorking}
                                min={record.startDate || '1960-01-01'}
                                max={new Date().toISOString().split('T')[0]}
                                errorMessage={errors?.[`workExperiences.${idx}.endDate`]}
                            />
                        )}
                    </div>

                    <TextArea
                        label="Description (Optional)"
                        name="description"
                        value={record.description || ''}
                        onChange={(e) => handleRecordChange(idx, 'description', e.target.value)}
                        placeholder="Describe your responsibilities, achievements, and key projects."
                        maxLength={1000}
                    />
                </div>
            ))}

            {records.length < 5 && (
                <ActionButton type="button" onClick={handleAdd} className={styles.addButton}>
                    Add Work Experience
                </ActionButton>
            )}

        </div>
    );
};

export default WorkExperienceForm;
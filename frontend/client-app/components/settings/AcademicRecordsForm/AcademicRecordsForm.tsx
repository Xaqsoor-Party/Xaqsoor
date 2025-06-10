import React from 'react';
import Input from '@/components/common/Input/Input';
import DatePicker from '@/components/common/DatePicker/DatePicker';
import ActionButton from '@/components/common/ActionButton/ActionButton';
import {AcademicRecordRequest} from "@/types/user";
import SelectInput from "@/components/common/SelectInput/SelectInput";
import Checkbox from "@/components/common/Checkbox/Checkbox";
import styles from './AcademicRecordsForm.module.css'

interface AcademicRecordsFormProps {
    records: AcademicRecordRequest[];
    onChange: (newRecords: AcademicRecordRequest[]) => void;
    errors?: { [key: string]: string };
}

const AcademicRecordsForm: React.FC<AcademicRecordsFormProps> = ({records, onChange,errors}) => {
    const handleRecordChange = (
        index: number,
        field: keyof AcademicRecordRequest,
        value: string | boolean
    ) => {
        const updated = [...records];
        // @ts-ignore
        updated[index][field] = value;
        onChange(updated);
    };

    // Add a blank record
    const handleAdd = () => {
        const newRecord: AcademicRecordRequest = {
            institutionName: '',
            degree: '',
            fieldOfStudy: '',
            level: '',
            location: '',
            currentlyStudying: false,
            startDate: '',
            endDate: '',
        };
        onChange([...records, newRecord]);
    };

    // Remove a record
    const handleRemove = (index: number) => {
        const updated = records.filter((_, idx) => idx !== index);
        onChange(updated);
    };

    return (
        <div className={styles.academicRecordsForm}>
            {records.map((record, idx) => (
                <div key={record.id} className={styles.recordItem}>

                    <div className={styles.recordHeader}>
                        <h3 className={styles.recordTitle}>Education Entry #{idx + 1}</h3>
                        <ActionButton type="button" onClick={() => handleRemove(idx)} className={styles.removeButton}>
                            Remove
                        </ActionButton>
                    </div>

                    <div className={styles.row}>
                        <Input
                            type={"text"}
                            label="Institution"
                            name="institutionName"
                            value={record.institutionName}
                            onChange={(e) => handleRecordChange(idx, 'institutionName', e.target.value)}
                            placeholder="Institution Name"
                            required
                            errorMessage={errors?.[`academicRecords.${idx}.institutionName`]}
                        />

                        <Input
                            type={"text"}
                            label="Qualification Achieved"
                            name="degree"
                            value={record.degree || ''}
                            onChange={(e) => handleRecordChange(idx, 'degree', e.target.value)}
                            placeholder="e.g., Bachelor of Science in Computer Engineering"
                        />
                    </div>

                    <div className={styles.row}>
                        <Input
                            type={"text"}
                            label="Field of Study"
                            name="fieldOfStudy"
                            value={record.fieldOfStudy}
                            onChange={(e) => handleRecordChange(idx, 'fieldOfStudy', e.target.value)}
                            placeholder="Field of Study"
                            required
                            errorMessage={errors?.[`academicRecords.${idx}.fieldOfStudy`]}
                        />

                        <SelectInput
                            label="Education Level"
                            name="level"
                            value={record.level}
                            onChange={(e) => handleRecordChange(idx, 'level', e.target.value)}
                            placeholder="Select your education level"
                            required
                            options={[
                                {value: 'HIGH_SCHOOL', label: 'High school'},
                                {value: 'DIPLOMA', label: 'Diploma'},
                                {value: 'BACHELORS', label: 'Bachelor\'s'},
                                {value: 'MASTERS', label: 'Master\'s'},
                                {value: 'PHD', label: 'PhD'},
                                {value: 'OTHER', label: 'Other'},
                            ]}
                            errorMessage={errors?.[`academicRecords.${idx}.level`]}
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
                        errorMessage={errors?.[`academicRecords.${idx}.location`]}
                    />

                    <Checkbox
                        label={"currentlyStudying"}
                        checked={record.currentlyStudying}
                        onChange={(e) => handleRecordChange(idx, 'currentlyStudying', e.target.checked)}
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
                            errorMessage={errors?.[`academicRecords.${idx}.startDate`]}
                        />
                        {!record.currentlyStudying && (
                            <DatePicker
                                label="End Date"
                                name="endDate"
                                value={record.endDate || null}
                                onChange={(e) => handleRecordChange(idx, 'endDate', e.target.value)}
                                disabled={record.currentlyStudying}
                                min={record.startDate || '1960-01-01'}
                                max={new Date().toISOString().split('T')[0]}
                                errorMessage={errors?.[`academicRecords.${idx}.endDate`]}
                            />
                        )}
                    </div>
                </div>
            ))}

            {records.length < 5 && (
                <ActionButton type="button" onClick={handleAdd} className={styles.addButton}>
                    Add Academic Record
                </ActionButton>
            )}

        </div>
    );
};

export default AcademicRecordsForm;

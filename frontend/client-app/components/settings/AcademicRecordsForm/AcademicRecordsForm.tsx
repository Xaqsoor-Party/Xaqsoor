import React from 'react';
import Input from '@/components/common/Input/Input';
import DatePicker from '@/components/common/DatePicker/DatePicker';
import ActionButton from '@/components/common/ActionButton/ActionButton';
import {AcademicRecordRequest, EducationLevel} from "@/types/user";
import SelectInput from "@/components/common/SelectInput/SelectInput";
import Checkbox from "@/components/common/Checkbox/Checkbox";
import styles from './AcademicRecordsForm.module.css'
import {useLanguage} from "@/context/LanguageContext";
import {getTranslations} from "@/translations";

interface AcademicRecordsFormProps {
    records: AcademicRecordRequest[];
    onChange: (newRecords: AcademicRecordRequest[]) => void;
    errors?: { [key: string]: string };
    hideRemoveIfSingle?: boolean;
}

const AcademicRecordsForm: React.FC<AcademicRecordsFormProps> = ({records, onChange, errors, hideRemoveIfSingle}) => {
    const handleRecordChange = (
        index: number,
        field: keyof AcademicRecordRequest,
        value: string | boolean
    ) => {
        const updated = [...records];
        // @ts-expect-error TS7053: Dynamic field assignment causes index signature error
        updated[index][field] = value;
        onChange(updated);
    };

    const {language} = useLanguage();
    const t = getTranslations(language, "settingsPage").academicRecordsForm;

    // Add a blank record
    const handleAdd = () => {
        const newRecord: AcademicRecordRequest = {
            institutionName: '',
            degree: '',
            fieldOfStudy: '',
            level: EducationLevel.OTHER,
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
    const shouldHideRemove = hideRemoveIfSingle && records.length === 1;
    return (
        <div className={styles.academicRecordsForm}>
            {records.map((record, idx) => (
                <div key={record.id} className={styles.recordItem}>

                    <div className={styles.recordHeader}>
                        <h3 className={styles.recordTitle}>{t.entryTitle} #{idx + 1}</h3>
                        {!shouldHideRemove && (
                            <ActionButton
                                type="button"
                                onClick={() => handleRemove(idx)}
                                className={styles.removeButton}
                            >
                                {t.removeButton}
                            </ActionButton>
                        )}
                    </div>

                    <div className={styles.row}>
                        <Input
                            type={"text"}
                            label={t.fields.institutionName.label}
                            name="institutionName"
                            value={record.institutionName}
                            onChange={(e) => handleRecordChange(idx, 'institutionName', e.target.value)}
                            placeholder={t.fields.institutionName.placeholder}
                            required
                            errorMessage={errors?.[`academicRecords.${idx}.institutionName`]}
                        />

                        <Input
                            type={"text"}
                            label={t.fields.degree.label}
                            name="degree"
                            value={record.degree || ''}
                            onChange={(e) => handleRecordChange(idx, 'degree', e.target.value)}
                            placeholder={t.fields.degree.placeholder}
                        />
                    </div>

                    <div className={styles.row}>
                        <Input
                            type={"text"}
                            label={t.fields.fieldOfStudy.label}
                            name="fieldOfStudy"
                            value={record.fieldOfStudy}
                            onChange={(e) => handleRecordChange(idx, 'fieldOfStudy', e.target.value)}
                            placeholder={t.fields.fieldOfStudy.placeholder}
                            required
                            errorMessage={errors?.[`academicRecords.${idx}.fieldOfStudy`]}
                        />

                        <SelectInput
                            label={t.fields.level.label}
                            name="level"
                            value={record.level}
                            onChange={(e) => handleRecordChange(idx, 'level', e.target.value)}
                            placeholder={t.fields.level.placeholder}
                            required
                            options={t.fields.level.options}
                            errorMessage={errors?.[`academicRecords.${idx}.level`]}
                        />
                    </div>

                    <Input
                        type={"text"}
                        label={t.fields.location.label}
                        name="location"
                        value={record.location}
                        onChange={(e) => handleRecordChange(idx, 'location', e.target.value)}
                        placeholder={t.fields.location.placeholder}
                        required
                        errorMessage={errors?.[`academicRecords.${idx}.location`]}
                    />

                    <Checkbox
                        label={t.fields.currentlyStudying.label}
                        checked={record.currentlyStudying}
                        onChange={(e) => handleRecordChange(idx, 'currentlyStudying', e.target.checked)}
                    />

                    <div className={styles.row}>
                        <DatePicker
                            label={t.fields.startDate.label}
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
                                label={t.fields.endDate.label}
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
                    {t.addButton}
                </ActionButton>
            )}

        </div>
    );
};

export default AcademicRecordsForm;

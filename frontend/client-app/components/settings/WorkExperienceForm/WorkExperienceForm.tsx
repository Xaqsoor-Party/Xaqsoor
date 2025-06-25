import React from 'react';
import Input from '@/components/common/Input/Input';
import DatePicker from '@/components/common/DatePicker/DatePicker';
import ActionButton from '@/components/common/ActionButton/ActionButton';
import Checkbox from '@/components/common/Checkbox/Checkbox';
import TextArea from '@/components/common/TextArea/TextArea';
import styles from './WorkExperienceForm.module.css';
import {WorkExperienceRequest} from "@/types/user";
import {getTranslations} from "@/translations";
import {useLanguage} from "@/context/LanguageContext";

interface WorkExperienceFormProps {
    records: WorkExperienceRequest[];
    onChange: (newRecords: WorkExperienceRequest[]) => void;
    errors?: { [key: string]: string };
    hideRemoveIfSingle?: boolean;
}

const WorkExperienceForm: React.FC<WorkExperienceFormProps> = ({records, onChange,errors,hideRemoveIfSingle}) => {
    const handleRecordChange = (
        index: number,
        field: keyof WorkExperienceRequest,
        value: string | boolean
    ) => {
        const updated = [...records];

        // @ts-expect-error TS7053: Dynamic field assignment causes index signature error
        (updated[index])[field] = value;
        onChange(updated);
    };

    const {language} = useLanguage();
    const t = getTranslations(language, "settingsPage").workExperienceForm;


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
    const shouldHideRemove = hideRemoveIfSingle && records.length === 1;
    return (
        <div className={styles.workExperienceForm}>
            {records.map((record, idx) => (
                <div key={record.id} className={styles.recordItem}>
                    <div className={styles.recordHeader}>
                        <h3 className={styles.recordTitle}>{t.entryTitle}</h3>
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
                            label={t.fields.jobTitle.label}
                            name="jobTitle"
                            value={record.jobTitle}
                            onChange={(e) => handleRecordChange(idx, 'jobTitle', e.target.value)}
                            placeholder={t.fields.jobTitle.placeholder}
                            required
                            maxLength={100}
                            errorMessage={errors?.[`workExperiences.${idx}.jobTitle`]}
                        />

                        <Input
                            type={"text"}
                            label={t.fields.companyName.label}
                            name="companyName"
                            value={record.companyName}
                            onChange={(e) => handleRecordChange(idx, 'companyName', e.target.value)}
                            placeholder={t.fields.companyName.placeholder}
                            required
                            maxLength={120}
                            errorMessage={errors?.[`workExperiences.${idx}.companyName`]}
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
                        maxLength={100}
                        errorMessage={errors?.[`workExperiences.${idx}.location`]}
                    />

                    <Checkbox
                        label={t.fields.currentlyWorking.label}
                        checked={record.currentlyWorking}
                        onChange={(e) => handleRecordChange(idx, 'currentlyWorking', e.target.checked)}
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
                            errorMessage={errors?.[`workExperiences.${idx}.startDate`]}
                        />
                        {!record.currentlyWorking && (
                            <DatePicker
                                label={t.fields.endDate.label}
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
                        label={t.fields.description.label}
                        name="description"
                        value={record.description || ''}
                        onChange={(e) => handleRecordChange(idx, 'description', e.target.value)}
                        placeholder={t.fields.description.placeholder}
                        maxLength={1000}
                    />
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

export default WorkExperienceForm;
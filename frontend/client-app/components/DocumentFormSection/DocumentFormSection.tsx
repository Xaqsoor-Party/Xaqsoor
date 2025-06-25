import React from "react";
import {DocumentType, UserDocumentRequestDto} from "@/types/FounderFormData";


import ActionButton from "@/components/common/ActionButton/ActionButton";
import SelectInput from "@/components/common/SelectInput/SelectInput";
import Input from "@/components/common/Input/Input";
import DatePicker from "@/components/common/DatePicker/DatePicker";
import FileUpload from "@/components/FileUpload/FileUpload";
import styles from "./DocumentFormSection.module.css";
import {useLanguage} from "@/context/LanguageContext";
import {getTranslations} from "@/translations";

interface DocumentFormSectionProps {
    documents: UserDocumentRequestDto[];
    onChange: (newRecords: UserDocumentRequestDto[]) => void;
    errors?: { [key: string]: string };
}

const DocumentFormSection: React.FC<DocumentFormSectionProps> = ({
                                                                     documents,
                                                                     onChange,
                                                                     errors,
                                                                 }) => {

    const {language} = useLanguage();
    const t = getTranslations(language, 'founderPages').founderOnboarding.document;

    const handleDocumentChange = (
        index: number,
        field: keyof UserDocumentRequestDto,
        value: string | boolean
    ) => {
        const updated = [...documents];
        // @ts-expect-error TS7053: Dynamic field assignment causes index signature error
        updated[index][field] = value;
        onChange(updated);
    };

    const handleAdd = () => {
        const newRecord: UserDocumentRequestDto = {
            documentType: DocumentType.PASSPORT,
            fileStorageKey: '',
            country: '',
            documentNumber: "",
            issuedAt: "",
            expiresAt: "",
        };
        onChange([...documents, newRecord]);
    };

    const handleRemove = (index: number) => {
        const updated = documents.filter((_, idx) => idx !== index);
        onChange(updated);
    };
    const getTodayDate = (): string => {
        return new Date().toISOString().split("T")[0];
    };

    return (
        <div className={styles.documentsForm}>
            {documents.map((document, idx) => (
                <div key={idx} className={styles.documentItem}>
                    <div className={styles.documentHeader}>
                        <h3 className={styles.documentTitle}>Document #{idx + 1}</h3>
                        {documents.length > 1 && (
                            <ActionButton
                                type="button"
                                onClick={() => handleRemove(idx)}
                                className={styles.removeButton}
                            >
                                {t.buttons.removeButton}
                            </ActionButton>
                        )}
                    </div>

                    <div className={styles.formRow}>
                        <SelectInput
                            label={t.fields.documentType.label}
                            name="documentType"
                            value={document.documentType}
                            onChange={(e) => handleDocumentChange(idx, 'documentType', e.target.value)}
                            required
                            placeholder={t.fields.documentType.placeholder}
                            options={t.fields.documentType.options}
                            errorMessage={errors?.[`documents.${idx}.documentType`]}
                        />

                        <Input
                            label={t.fields.documentCountry.label}
                            placeholder={t.fields.documentCountry.placeholder}
                            name="country"
                            type="text"
                            value={document.country}
                            onChange={(e) => handleDocumentChange(idx, 'country', e.target.value)}
                            required
                            errorMessage={errors?.[`documents.${idx}.country`]}
                        />
                    </div>

                    <Input
                        label={t.fields.documentNumber.label}
                        placeholder={t.fields.documentNumber.placeholder}
                        name="documentNumber"
                        type="text"
                        value={document.documentNumber}
                        onChange={(e) => handleDocumentChange(idx, 'documentNumber', e.target.value)}
                        required
                        errorMessage={errors?.[`documents.${idx}.documentNumber`]}
                    />

                    <div className={styles.formRow}>
                        <DatePicker
                            label={t.fields.issuedAt.label}
                            name="issuedAt"
                            value={document.issuedAt}
                            onChange={(e) => handleDocumentChange(idx, 'issuedAt', e.target.value)}
                            required
                            max={getTodayDate()}
                            errorMessage={errors?.[`documents.${idx}.issuedAt`]}
                        />

                        <DatePicker
                            label={t.fields.expiresAt.label}
                            name="expiresAt"
                            value={document.expiresAt}
                            onChange={(e) => handleDocumentChange(idx, 'expiresAt', e.target.value)}
                            errorMessage={errors?.[`documents.${idx}.expiresAt`]}
                            min={getTodayDate()}
                        />
                    </div>
                    <FileUpload
                        fileType="id-documents"
                        currentFile={document.fileStorageKey}
                        onChange={(result) => handleDocumentChange(idx, "fileStorageKey", result?.key || "")}
                        error={errors?.[`documents.${idx}.fileStorageKey`]}
                        required
                    />
                </div>
            ))}
            <ActionButton type="button" onClick={handleAdd} className={styles.addButton}>
                {t.buttons.addButton}
            </ActionButton>
        </div>
    )
};

export default DocumentFormSection;

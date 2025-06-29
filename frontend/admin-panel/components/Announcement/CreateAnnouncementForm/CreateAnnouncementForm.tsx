import React, {useState} from 'react';
import Input from '@/components/common/Input/Input';
import TextArea from '@/components/common/TextArea/TextArea';
import SelectInput from '@/components/common/SelectInput/SelectInput';
import ActionButton from '@/components/common/ActionButton/ActionButton';
import styles from './CreateAnnouncementForm.module.css';
import {statusOptions} from "@/pages/campaign/announcements";

interface CreateAnnouncementFormProps {
    onSubmit: (data: {
        title: string;
        content: string;
        status: string;
    }) => void;
    onCancel: () => void;
    loading?: boolean;
}


const CreateAnnouncementForm: React.FC<CreateAnnouncementFormProps> = ({onSubmit, loading,onCancel}) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!title || !content || !status ) {
            alert("All fields are required.");
            return;
        }

        onSubmit({title, content, status});
    };

    return (
        <div className={styles.modalOverlay}>
           <div className={styles.modalContent}>
               <h2 className={styles.formTitle}>Create New Announcement</h2>
               <form onSubmit={handleSubmit} className={styles.formContainer}>
                   <Input
                       label="Title"
                       value={title}
                       onChange={e => setTitle(e.target.value)}
                       type="text"
                       required
                       placeholder="Enter announcement title"
                   />

                   <TextArea
                       label="Content"
                       value={content}
                       onChange={e => setContent(e.target.value)}
                       required
                       placeholder="Write the content of the announcement"
                   />

                   <SelectInput
                       label="Status"
                       value={status}
                       onChange={e => setStatus(e.target.value)}
                       options={statusOptions}
                       required
                       placeholder="-- Select status --"
                   />

                   <div className={styles.buttonWrapper}>
                       <ActionButton type="submit" disabled={loading} className={styles.button}>
                           {loading ? 'Creating...' : 'Create Announcement'}
                       </ActionButton>

                       <ActionButton
                           onClick={onCancel}
                           className={styles.cancelButton}
                       >
                           Cancel
                       </ActionButton>
                   </div>
               </form>
           </div>
       </div>
    );
};

export default CreateAnnouncementForm;

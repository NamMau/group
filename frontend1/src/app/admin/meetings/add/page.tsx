import React from 'react';
import AddMeetingForm from './AddMeetingForm';
import styles from './add.module.css';

export default function AddMeetingPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create New Meeting</h1>
      <AddMeetingForm />
    </div>
  );
} 
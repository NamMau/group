'use client';

import React from 'react';
import EditMeetingForm from './EditMeetingForm';
import styles from '../../meetings.module.css';

export default function EditMeetingPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Edit Meeting</h1>
      <EditMeetingForm meetingId={resolvedParams.id} />
    </div>
  );
} 
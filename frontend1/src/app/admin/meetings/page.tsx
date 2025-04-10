'use client';

import React from 'react';
import Link from 'next/link';
import MeetingList from './MeetingList';
import styles from './meetings.module.css';

export default function MeetingsPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Meetings</h1>
        {/* <Link href="/admin/meetings/add" className={styles.addButton}>
          Add New Meeting
        </Link> */}
      </div>
      <MeetingList />
    </div>
  );
} 
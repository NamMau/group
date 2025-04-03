'use client';

import { useState } from 'react';
import CourseTable from './CourseTable';
import styles from './course.module.css';

export default function CoursePage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Course Management</h1>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>
      <CourseTable searchTerm={searchTerm} />
    </div>
  );
} 
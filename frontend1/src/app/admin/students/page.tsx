'use client';

import { useState } from 'react';
import styles from './students.module.css';
import StudentsTable from './StudentsTable';
import './metadata';

export default function Students() {
  const [searchTerm, setSearchTerm] = useState<string>('');

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.filterButton}>
          Add filter ▼
        </button>
        <input
          type="text"
          placeholder="Search for students by name or email"
          className={styles.searchInputWide}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Bảng danh sách học sinh */}
      <StudentsTable searchTerm={searchTerm} />
    </div>
  );
} 
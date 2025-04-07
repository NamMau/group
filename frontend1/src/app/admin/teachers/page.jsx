'use client';

import { useState } from 'react';
import styles from './teachers.module.css';
import TeachersTable from './TeachersTable';
import './metadata'; // Import để đảm bảo file metadata.jsx được tải, nhưng không export lại

export default function Teachers() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className={styles.teachers}>
      {/* Thanh tìm kiếm và bộ lọc */}
      <div className={styles.header}>
        <div className={styles.searchBar}>
          <div className={styles.filter}>
            <select className={styles.filterSelect}>
              <option>Add filter</option>
            </select>
          </div>
          <input
            type="text"
            placeholder="Search for a teacher by name or email"
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Bảng danh sách giáo viên */}
      <TeachersTable searchTerm={searchTerm} />
    </div>
  );
}
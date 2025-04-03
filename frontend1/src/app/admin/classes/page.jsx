'use client';

import { useState } from 'react';
import styles from './classes.module.css';
import ClassesTable from './ClassesTable';

export default function Classes() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className={styles.classes}>
      <div className={styles.header}>
        <div className={styles.searchBar}>
          <div className={styles.filter}>
            <select className={styles.filterSelect}>
              <option value="">Add filter</option>
            </select>
          </div>
          <input
            type="text"
            placeholder="Search for a class by name or code"
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <ClassesTable searchTerm={searchTerm} />
    </div>
  );
}

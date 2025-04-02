'use client';

import { useState, useEffect } from 'react';
import styles from './classes.module.css';
import ClassesTable from './ClassesTable';

export const metadata = {
  title: 'Admin Classes',
};

export default function Classes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [classes, setClasses] = useState([]);

  // Function gọi API tìm kiếm lớp
  const fetchClasses = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/classes/search-class?className=${searchTerm}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setClasses(data);
      } else {
        console.error('Failed to fetch classes');
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchClasses();
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  return (
    <div className={styles.classes}>
      {/* Search bar */}
      <div className={styles.searchBar}>
        <div className={styles.filter}>
          <select>
            <option>Add filter</option>
          </select>
        </div>
        <input
          type="text"
          placeholder="Search for a class by name"
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* List classes */}
      <ClassesTable classes={classes} />
    </div>
  );
}

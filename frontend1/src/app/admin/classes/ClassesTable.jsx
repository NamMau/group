'use client';

import { useState } from 'react';
import styles from './classes.module.css';

export default function ClassesTable() {
  const classes = [
    {
      id: 1,
      name: 'Class A',
      teacherName: 'Kristen Watson',
      course: 'Mathematics',
      description: 'Start date: 2024-09-26 09:16:23 and end date: 2024-12-26 09:16:23 created by admin',
      quantity: 210,
    },
    {
      id: 2,
      name: 'Class B',
      teacherName: 'Kristen Watson',
      course: 'Physics',
      description: 'Start date: 2024-09-26 09:16:23 and end date: 2024-12-26 09:16:23 created by admin',
      quantity: 210,
    },
    {
      id: 3,
      name: 'Class C',
      teacherName: 'Kristen Watson',
      course: 'Chemistry',
      description: 'Start date: 2024-09-26 09:16:23 and end date: 2024-12-26 09:16:23 created by admin',
      quantity: 210,
    },
  ];

  const [selectedClasses, setSelectedClasses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const classesPerPage = 2;
  const totalPages = Math.ceil(classes.length / classesPerPage);
  const startIndex = (currentPage - 1) * classesPerPage;
  const currentClasses = classes.slice(startIndex, startIndex + classesPerPage);

  const handleSelectClass = (id) => {
    if (selectedClasses.includes(id)) {
      setSelectedClasses(selectedClasses.filter((classId) => classId !== id));
    } else {
      setSelectedClasses([...selectedClasses, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedClasses.length === currentClasses.length) {
      setSelectedClasses([]);
    } else {
      setSelectedClasses(currentClasses.map((classItem) => classItem.id));
    }
  };

  const handleDeleteAll = () => {
    alert('Delete all selected classes');
    setSelectedClasses([]);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedClasses([]);
  };

  if (classes.length === 0) {
    return (
      <div className={styles.content}>
        <div className={styles.noClasses}>
          <div className={styles.koalaImage}>🐨 Z Z</div>
          <h2 className={styles.title}>No classes at this time</h2>
          <p className={styles.description}>
            Classes will appear here after they are created in your school.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {selectedClasses.length > 0 && (
        <div className={styles.deleteAllContainer}>
          <button className={styles.deleteAllButton} onClick={handleDeleteAll}>
            Delete All
          </button>
        </div>
      )}

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedClasses.length === currentClasses.length && currentClasses.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th>Name</th>
              <th>Teachers Name</th>
              <th>Course</th>
              <th>Description</th>
              <th>Quantity</th>
              <th>Operation</th>
            </tr>
          </thead>
          <tbody>
            {currentClasses.map((classItem) => (
              <tr key={classItem.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedClasses.includes(classItem.id)}
                    onChange={() => handleSelectClass(classItem.id)}
                  />
                </td>
                <td>{classItem.name}</td>
                <td className={styles.teacherCell}>
                  <img
                    src="https://via.placeholder.com/40"
                    alt="Avatar"
                    className={styles.avatar}
                  />
                  {classItem.teacherName}
                </td>
                <td>{classItem.course}</td>
                <td>{classItem.description}</td>
                <td>{classItem.quantity}</td>
                <td>
                  <button className={styles.editButton}>✏️</button>
                  <button className={styles.deleteButton}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.pagination}>
          <span>Showing {startIndex + 1}-{Math.min(startIndex + classesPerPage, classes.length)}</span>
          <div className={styles.pageButtons}>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                className={currentPage === index + 1 ? styles.activePage : styles.pageButton}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
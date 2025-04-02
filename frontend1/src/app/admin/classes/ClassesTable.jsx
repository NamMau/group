'use client';

import { useState, useEffect } from 'react';
import styles from './classes.module.css';

export default function ClassesTable() {
  const [classes, setClasses] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const classesPerPage = 2;
  
  // Lấy danh sách lớp học từ API
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/v1/classes/get-all-classes', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        const data = await response.json();
        setClasses(data);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };

    fetchClasses();
  }, []);

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
      setSelectedClasses(currentClasses.map((classItem) => classItem._id));
    }
  };

  const handleDeleteClass = async (classId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/classes/delete-class/${classId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (response.ok) {
        setClasses(classes.filter((classItem) => classItem._id !== classId));
      } else {
        console.error('Failed to delete class');
      }
    } catch (error) {
      console.error('Error deleting class:', error);
    }
  };

  const handleDeleteAll = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/classes/delete-all-classes', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      });

      if (response.ok) {
        setClasses([]);
        setSelectedClasses([]);
      } else {
        console.error('Failed to delete all classes');
      }
    } catch (error) {
      console.error('Error deleting all classes:', error);
    }
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
              <th>Teacher</th>
              <th>Course</th>
              <th>Description</th>
              <th>Quantity</th>
              <th>Operation</th>
            </tr>
          </thead>
          <tbody>
            {currentClasses.map((classItem) => (
              <tr key={classItem._id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedClasses.includes(classItem._id)}
                    onChange={() => handleSelectClass(classItem._id)}
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
                  <button className={styles.deleteButton} onClick={() => handleDeleteClass(classItem._id)}>🗑️</button>
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

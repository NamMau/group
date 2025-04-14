'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import styles from './classes.module.css';
import { authService } from '../../../services/authService';
import { classService } from '../../../services/classService';

export default function ClassesTable({searchTerm} ) {
  const [classes, setClasses] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const classesPerPage = 2;

  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!authService.isAuthenticated()) {
        router.push('/admin/login');
        return;
      }

      const classesData = await classService.getAllClasses();
      setClasses(classesData);
    } catch (error) {
      if (error.message === 'Unauthorized') {
        authService.removeToken();
        router.push('/admin/login');
      } else {
        console.error('Error fetching classes:', error);
        setError(error.message || 'Failed to fetch classes');
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  useEffect(() => {
    console.log("classes state:", classes);
  }, [classes]);

  // const totalPages = Math.ceil(classes.length / classesPerPage);
  // const startIndex = (currentPage - 1) * classesPerPage;
  // const currentClasses = classes.slice(startIndex, startIndex + classesPerPage);
  const filteredClasses = classes.filter(classItem =>
    classItem.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const totalPages = Math.ceil(filteredClasses.length / classesPerPage);
  const startIndex = (currentPage - 1) * classesPerPage;
  const currentClasses = filteredClasses.slice(startIndex, startIndex + classesPerPage);
  

  const handleSelectClass = (id) => {
    setSelectedClasses(prev =>
      prev.includes(id) ? prev.filter(classId => classId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedClasses.length === currentClasses.length) {
      setSelectedClasses([]);
    } else {
      setSelectedClasses(currentClasses.map(c => c._id));
    }
  };

  const handleDeleteClass = async (classId) => {
    try {
      if (!authService.isAuthenticated()) {
        router.push('/admin/login');
        return;
      }

      await classService.deleteClass(classId);
      fetchClasses();
    } catch (error) {
      if (error.message === 'Unauthorized') {
        authService.removeToken();
        router.push('/admin/login');
      } else {
        alert(error.message || 'Failed to delete class');
      }
    }
  };

  const handleDeleteAll = async () => {
    try {
      if (!authService.isAuthenticated()) {
        router.push('/admin/login');
        return;
      }

      await classService.deleteAllClasses();
      fetchClasses();
      setSelectedClasses([]);
    } catch (error) {
      if (error.message === 'Unauthorized') {
        authService.removeToken();
        router.push('/admin/login');
      } else {
        alert(error.message || 'Failed to delete all classes');
      }
    }
  };

  const handleUpdateClass = (classId) => {
    if (!authService.isAuthenticated()) {
      router.push('/admin/login');
      return;
    }

    router.push(`/admin/classes/edit/${classId}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedClasses([]);
  };

  // UI Rendering
  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

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
                  checked={
                    selectedClasses.length === currentClasses.length &&
                    currentClasses.length > 0
                  }
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
                  {classItem.tutor.fullName}
                </td>
                <td>{Array.isArray(classItem.courses) && classItem.courses.length > 0 
                    ? classItem.courses.map(course => course.name).join(', ') 
                    : 'No course assigned'}</td>
                <td>{classItem.description}</td>
                <td>{classItem.quantity}</td>
                <td>
                  <button
                    className={styles.editButton}
                    onClick={() => handleUpdateClass(classItem._id)}
                  >
                    ✏️
                  </button>
                  <button
                    className={styles.addMeetingButton}
                    onClick={() => router.push(`/admin/meetings/add?classId=${classItem._id}`)}
                  >
                    📅
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteClass(classItem._id)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.pagination}>
          <span>
            Showing {startIndex + 1}-{Math.min(startIndex + classesPerPage, classes.length)}
          </span>
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

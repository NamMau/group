'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './classes.module.css';
import { authService, API_URL } from '../../../services/authService';

export default function ClassesTable() {
  const [classes, setClasses] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const classesPerPage = 2;
  
  // Lấy danh sách lớp học từ API
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!authService.isAuthenticated()) {
          console.log('Not authenticated, redirecting to login');
          router.push('/admin/login');
          return;
        }

        const response = await fetch(`${API_URL}/classes/get-all-classes`, {
          method: 'GET',
          headers: authService.getAuthHeaders(),
          cache: 'no-store'
        });

        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);

        if (!response.ok) {
          if (response.status === 401) {
            console.log('Unauthorized, removing token and redirecting');
            authService.removeToken();
            router.push('/admin/login');
            return;
          }
          throw new Error(data.message || 'Failed to fetch classes');
        }

        // Ensure we're setting an array
        setClasses(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching classes:', error);
        setError(error.message || 'Failed to fetch classes');
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [router]);

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
      if (!authService.isAuthenticated()) {
        router.push('/admin/login');
        return;
      }

      const response = await fetch(`${API_URL}/classes/delete-class/${classId}`, {
        method: 'DELETE',
        headers: authService.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          authService.removeToken();
          router.push('/admin/login');
          return;
        }
        throw new Error(data.message || 'Failed to delete class');
      }

      setClasses(classes.filter((classItem) => classItem._id !== classId));
    } catch (error) {
      console.error('Error deleting class:', error);
      alert(error.message || 'Failed to delete class');
    }
  };

  const handleDeleteAll = async () => {
    try {
      if (!authService.isAuthenticated()) {
        router.push('/admin/login');
        return;
      }

      const response = await fetch(`${API_URL}/classes/delete-all-classes`, {
        method: 'DELETE',
        headers: authService.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          authService.removeToken();
          router.push('/admin/login');
          return;
        }
        throw new Error(data.message || 'Failed to delete all classes');
      }

      setClasses([]);
      setSelectedClasses([]);
    } catch (error) {
      console.error('Error deleting all classes:', error);
      alert(error.message || 'Failed to delete all classes');
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedClasses([]);
  };

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

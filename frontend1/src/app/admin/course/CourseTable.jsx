'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './course.module.css';

export default function CourseTable() {
  const router = useRouter();
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [courses, setCourses] = useState([ /* Mock courses here */ ]);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 2;

  const totalPages = Math.ceil(courses.length / coursesPerPage);
  const startIndex = (currentPage - 1) * coursesPerPage;
  const currentCourses = courses.slice(startIndex, startIndex + coursesPerPage);

  // const handleSelectCourse = (id) => {
  //   setSelectedCourses((prev) =>
  //     prev.includes(id) ? prev.filter((courseId) => courseId !== id) : [...prev, id]
  //   );
  // };
  const handleSelectCourse = (id) => {
    if (selectedCourses.includes(id)) {
      setSelectedCourses(selectedCourses.filter((courseId) => courseId !== id));
    } else {
      setSelectedCourses([...selectedCourses, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedCourses.length === currentCourses.length) {
      setSelectedCourses([]);
    } else {
      setSelectedCourses(currentCourses.map((course) => course.id));
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEditCourse = async (courseId) => {
    const newName = prompt('Enter new course name:'); // Lấy tên mới từ người dùng
    const newDescription = prompt('Enter new description:'); // Lấy mô tả mới từ người dùng
  
    if (!newName || !newDescription) {
      alert('Course name and description cannot be empty.');
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:5000/api/v1/courses/update-course/${courseId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Token từ localStorage
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName, description: newDescription }),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        alert(result.message || 'Failed to update course');
      } else {
        alert('Course updated successfully!');
        setCourses(courses.map(course => course.id === courseId ? { ...course, name: newName, description: newDescription } : course));
      }
    } catch (error) {
      console.error(error);
      alert('Failed to update course');
    }
  };
  

  const handleDeleteCourse = async (courseId) => {
    const confirmed = window.confirm('Are you sure you want to delete this course?');
    if (confirmed) {
      try {
        const response = await fetch(`http://localhost:5000/api/v1/courses/delete-course/${courseId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Token from localStorage
            'Content-Type': 'application/json',
          },
        });
        const result = await response.json();

        if (!response.ok) {
          alert(result.message || 'Failed to delete course');
        } else {
          alert('Course deleted successfully!');
          setCourses(courses.filter((course) => course.id !== courseId)); // Remove deleted course from UI
        }
      } catch (error) {
        console.error(error);
        alert('Failed to delete course');
      }
    }
  };

  if (courses.length === 0) {
    return (
      <div className={styles.content}>
        <div className={styles.noCourses}>
          <div className={styles.koalaImage}>🐨 Z Z</div>
          <h2 className={styles.title}>No course found</h2>
          <p className={styles.description}>
            Try searching with a different name.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Delete selected courses button */}
      {selectedCourses.length > 0 && (
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
                  checked={selectedCourses.length === currentCourses.length && currentCourses.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th>Name</th>
              <th>Last updated</th>
              <th>Operation</th>
            </tr>
          </thead>
          <tbody>
            {currentCourses.map((course) => (
              <tr key={course.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedCourses.includes(course.id)}
                    onChange={() => handleSelectCourse(course.id)}
                  />
                </td>
                <td>{course.name}</td>
                <td>{course.description}</td>
                <td>
                  <button
                    className={styles.editButton}
                    onClick={() => handleEditCourse(course.id)}
                  >
                    ✏️
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteCourse(course.id)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className={styles.pagination}>
          <span>Showing {startIndex + 1} of {Math.min(startIndex + coursesPerPage, courses.length)}</span>
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

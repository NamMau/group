'use client';

import { useState } from 'react';
import styles from './course.module.css';

export default function CourseTable() {
  // Mock data cho danh sách khóa học
  const courses = [
    {
      id: 1,
      name: 'Kristen Watson',
      description: 'Start date: 2024-09-26 16:13:25 and end date: 2024-09-26 00:00:00 created by admin',
    },
    {
      id: 2,
      name: 'Kristen Watson',
      description: 'Start date: 2024-09-26 16:13:25 and end date: 2024-09-26 00:00:00 created by admin',
    },
    {
      id: 3,
      name: 'Kristen Watson',
      description: 'Start date: 2024-09-26 16:13:25 and end date: 2024-09-26 00:00:00 created by admin',
    },
    {
      id: 4,
      name: 'Kristen Watson',
      description: 'Start date: 2024-09-26 16:13:25 and end date: 2024-09-26 00:00:00 created by admin',
    },
  ];

  // Trạng thái cho checkbox
  const [selectedCourses, setSelectedCourses] = useState([]);

  // Trạng thái cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 2; // Hiển thị 2 khóa học mỗi trang
  const totalPages = Math.ceil(courses.length / coursesPerPage); // Sẽ là 2 trang (4 khóa học / 2 = 2)
  const startIndex = (currentPage - 1) * coursesPerPage;
  const currentCourses = courses.slice(startIndex, startIndex + coursesPerPage);

  // Xử lý chọn/tỏ chọn khóa học
  const handleSelectCourse = (id) => {
    if (selectedCourses.includes(id)) {
      setSelectedCourses(selectedCourses.filter((courseId) => courseId !== id));
    } else {
      setSelectedCourses([...selectedCourses, id]);
    }
  };

  // Xử lý chọn tất cả
  const handleSelectAll = () => {
    if (selectedCourses.length === currentCourses.length) {
      setSelectedCourses([]);
    } else {
      setSelectedCourses(currentCourses.map((course) => course.id));
    }
  };

  // Xử lý xóa tất cả
  const handleDeleteAll = () => {
    alert('Delete all selected courses');
    setSelectedCourses([]);
  };

  // Xử lý chuyển trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedCourses([]);
  };

  // Nếu danh sách rỗng, hiển thị giao diện con gấu
  if (courses.length === 0) {
    return (
      <div className={styles.content}>
        <div className={styles.noCourses}>
          <div className={styles.koalaImage}>🐨 Z Z</div>
          <h2 className={styles.title}>No course at this time</h2>
          <p className={styles.description}>
            Courses will appear here after they are created in your school.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Nút Delete All được đặt bên trên bảng */}
      {selectedCourses.length > 0 && (
        <div className={styles.deleteAllContainer}>
          <button className={styles.deleteAllButton} onClick={handleDeleteAll}>
            Delete All
          </button>
        </div>
      )}

      {/* Bảng danh sách khóa học */}
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
                  <button className={styles.editButton}>✏️</button>
                  <button className={styles.deleteButton}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Phân trang */}
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
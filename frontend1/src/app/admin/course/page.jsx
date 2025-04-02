'use client';

import { useState } from 'react';
import styles from './course.module.css';
import CourseTable from './CourseTable';

export const metadata = {
  title: 'Admin Course',
};

export default function Course() {
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState([]);

  // Xử lý tìm kiếm khóa học
  const handleSearch = async (e) => {
    if (e.key === 'Enter' && searchTerm.trim() !== '') {
      try {
        const response = await fetch(`http://localhost:5000/api/v1/courses/getcoursebyname/${searchTerm}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const result = await response.json();

        if (!response.ok) {
          alert(result.message || 'Failed to fetch courses');
        } else {
          setCourses(result); // Cập nhật danh sách khóa học với kết quả tìm kiếm
        }
      } catch (error) {
        console.error(error);
        alert('Error fetching courses');
      }
    }
  };

  return (
    <div className={styles.course}>
      {/* Thanh tìm kiếm */}
      <div className={styles.searchBar}>
        <div className={styles.filter}>
          <select>
            <option>Add filter</option>
          </select>
        </div>
        <input
          type="text"
          placeholder="Search for a course by name"
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleSearch}
        />
      </div>

      {/* Bảng danh sách khóa học */}
      <CourseTable courses={courses} />
    </div>
  );
}

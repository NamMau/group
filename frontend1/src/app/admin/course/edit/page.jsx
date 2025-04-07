'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './edit.module.css';

export default function EditCourse() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get('courseId');

  const [courseData, setCourseData] = useState({
    id: '',
    name: '',
    description: '',
  });

  // Giả lập lấy dữ liệu khóa học dựa trên courseId
  useEffect(() => {
    if (courseId) {
      // Thay thế bằng API call thực tế
      const mockCourses = [
        {
          id: '1',
          name: 'Mathematics',
          description: 'A comprehensive course on mathematics for high school students.',
        },
        {
          id: '2',
          name: 'Physics',
          description: 'An introductory course on physics covering mechanics and thermodynamics.',
        },
      ];
      const foundCourse = mockCourses.find((c) => c.id === courseId);
      if (foundCourse) {
        setCourseData(foundCourse);
      } else {
        alert('Course not found!');
        router.push('/admin/course');
      }
    }
  }, [courseId, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Thay thế bằng API call để cập nhật khóa học
    console.log('Updated course:', courseData);
    alert('Course updated successfully!');
    router.push('/admin/course');
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>Edit Course</h1>
        <h2 className={styles.subtitle}>MANUALLY</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Hàng 1: Name Course */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Name Course</label>
              <input
                type="text"
                id="name"
                name="name"
                value={courseData.name}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Hàng 2: Description */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={courseData.description}
                onChange={handleInputChange}
                rows="4"
              />
            </div>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.addAnother} onClick={() => router.push('/admin/course/add')}>
              <span className={styles.plusIcon}>+</span> Add another
            </button>
            <button type="submit" className={styles.submitButton}>
              Update course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
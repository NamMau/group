'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './edit.module.css';

export default function EditCourse() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get('courseId');

  const [courseData, setCourseData] = useState({
    name: '',
    description: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (courseId) {
      fetch(`http://localhost:5000/api/v1/courses/${courseId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && !data.error) {
            setCourseData({
              name: data.name || '',
              description: data.description || '',
            });
          } else {
            setError('Course not found');
            router.push('/admin/course');
          }
        })
        .catch(() => setError('Failed to fetch course data'))
        .finally(() => setLoading(false));
    }
  }, [courseId, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5000/api/v1/courses/update-course/${courseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(courseData),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to update course');

      alert('Course updated successfully!');
      router.push('/admin/course');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>Edit Course</h1>
        <h2 className={styles.subtitle}>MANUALLY</h2>

        {error && <p className={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} className={styles.form}>
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
            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? 'Updating...' : 'Update Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

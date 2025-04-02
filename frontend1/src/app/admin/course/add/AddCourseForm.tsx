'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './add.module.css';

export default function AddCourseForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddCourse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const courseData = {
      name: formData.get('courseName'),
      description: formData.get('description'),
      category: formData.get('category'),
      level: formData.get('level'),
      startDate: formData.get('startDate'),
      endDate: formData.get('endDate'),
      status: formData.get('status'),
    };

    try {
      const response = await fetch('http://localhost:5000/api/v1/courses/create-course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(courseData),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to add course');

      alert('Course added successfully!');
      router.push('/admin/course');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAnother = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.currentTarget.form?.reset();
  };

  return (
    <div className={styles.addCourse}>
      <h1 className={styles.title}>Add Course</h1>
      <p className={styles.subtitle}>Manually</p>

      {error && <p className={styles.error}>{error}</p>}

      <form className={styles.form} onSubmit={handleAddCourse}>
        <div className={styles.formGroup}>
          <label htmlFor="courseName">Name Course</label>
          <input type="text" id="courseName" name="courseName" placeholder="Name Course" className={styles.input} required />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" placeholder="Description" className={styles.input} rows={4} required />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="category">Category</label>
          <input type="text" id="category" name="category" placeholder="Category" className={styles.input} />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="level">Level</label>
          <select id="level" name="level" className={styles.input}>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="startDate">Start Date</label>
          <input type="date" id="startDate" name="startDate" className={styles.input} />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="endDate">End Date</label>
          <input type="date" id="endDate" name="endDate" className={styles.input} />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="status">Status</label>
          <select id="status" name="status" className={styles.input}>
            <option value="not_started">Not Started</option>
            <option value="ongoing">Ongoing</option>
            <option value="finished">Finished</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>

        <div className={styles.buttonGroup}>
          <button type="button" className={styles.addAnotherButton} onClick={handleAddAnother}>
            <span className={styles.plusIcon}>+</span> Add another
          </button>
          <button type="submit" className={styles.addCourseButton} disabled={loading}>
            {loading ? 'Adding...' : 'Add Course'}
          </button>
        </div>
      </form>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './edit.module.css';
import { courseService } from '../../../../services/courseService';

export default function EditCourse() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get('courseId');

  const [courseData, setCourseData] = useState({
    name: '',
    description: '',
    category: '',
    level: '',
    startDate: '',
    endDate: '',
    status: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCourseData() {
      if (courseId) {
        try {
          const data = await courseService.getCourse(courseId);
          setCourseData({
            name: data.name || '',
            description: data.description || '',
            category: data.category || '',
            level: data.level || '',
            startDate: data.startDate || '',
            endDate: data.endDate || '',
            status: data.status || ''
          });
        } catch (err) {
          setError(err.message);
          alert('Course not found!');
          router.push('/admin/course');
        } finally {
          setLoading(false);
        }
      }
    }
    fetchCourseData();
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
      await courseService.updateCourse(courseId, courseData);
      alert('Course updated successfully!');
      router.push('/admin/course');
    } catch (err) {
      setError(err.message);
      alert('Error updating course');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>Edit Course</h1>
        {error && <p className={styles.error}>{error}</p>}
        
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Course Name</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              value={courseData.name}
              onChange={handleInputChange}
              className={styles.input} 
              required 
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Description</label>
            <textarea 
              id="description" 
              name="description" 
              value={courseData.description}
              onChange={handleInputChange}
              className={styles.input} 
              rows={4} 
              required 
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="category">Category</label>
              <select 
                id="category" 
                name="category" 
                value={courseData.category}
                onChange={handleInputChange}
                className={styles.input} 
                required
              >
                <option value="">Select Category</option>
                <option value="programming">Programming</option>
                <option value="design">Design</option>
                <option value="business">Business</option>
                <option value="marketing">Marketing</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="level">Level</label>
              <select 
                id="level" 
                name="level" 
                value={courseData.level}
                onChange={handleInputChange}
                className={styles.input} 
                required
              >
                <option value="">Select Level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="startDate">Start Date</label>
              <input 
                type="date" 
                id="startDate" 
                name="startDate" 
                value={courseData.startDate}
                onChange={handleInputChange}
                className={styles.input} 
                required 
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="endDate">End Date</label>
              <input 
                type="date" 
                id="endDate" 
                name="endDate" 
                value={courseData.endDate}
                onChange={handleInputChange}
                className={styles.input} 
                required 
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="status">Status</label>
            <select 
              id="status" 
              name="status" 
              value={courseData.status}
              onChange={handleInputChange}
              className={styles.input} 
              required
            >
              <option value="">Select Status</option>
              <option value="not_started">Not Started</option>
              <option value="ongoing">Ongoing</option>
              <option value="finished">Finished</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>

          <div className={styles.buttonGroup}>
            <button 
              type="submit" 
              className={styles.saveButton} 
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button 
              type="button" 
              onClick={() => router.push('/admin/course')}
              className={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

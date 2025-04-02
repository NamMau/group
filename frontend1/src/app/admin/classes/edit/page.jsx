'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './edit.module.css';

export default function EditClass() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const classId = searchParams.get('classId');

  const [classData, setClassData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    quantity: '',
    students: [],
    tutor: '',
    status: '',
    courses: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchClassData() {
      if (classId) {
        try {
          const response = await fetch(`http://localhost:5000/api/v1/classes/get-all-classes`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (!response.ok) throw new Error('Failed to fetch class data');
          const data = await response.json();
          setClassData(data);
        } catch (err) {
          setError(err.message);
          alert('Class not found!');
          router.push('/admin/classes');
        }
      }
    }
    fetchClassData();
  }, [classId, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClassData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/api/v1/classes/update-class/${classId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(classData),
      });
      if (!response.ok) throw new Error('Failed to update class');
      alert('Class updated successfully!');
      router.push('/admin/classes');
    } catch (err) {
      setError(err.message);
      alert('Error updating class');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>Edit Class</h1>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="startDate">Start Date</label>
              <input type="date" id="startDate" name="startDate" value={classData.startDate} onChange={handleInputChange} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="endDate">End Date</label>
              <input type="date" id="endDate" name="endDate" value={classData.endDate} onChange={handleInputChange} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="quantity">Number of Students</label>
              <input type="number" id="quantity" name="quantity" value={classData.quantity} onChange={handleInputChange} readOnly />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Class Name</label>
              <input type="text" id="name" name="name" value={classData.name} onChange={handleInputChange} required />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="tutor">Tutor</label>
              <select id="tutor" name="tutor" value={classData.tutor} onChange={handleInputChange} required>
                <option value="">Select Tutor</option>
                {classData.students.map((student) => (
                  <option key={student._id} value={student._id}>{student.name}</option>
                ))}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="courses">Courses</label>
              <select id="courses" name="courses" value={classData.courses} onChange={handleInputChange} required multiple>
                {classData.courses.map((course) => (
                  <option key={course._id} value={course._id}>{course.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="status">Status</label>
              <select id="status" name="status" value={classData.status} onChange={handleInputChange}>
                <option value="not_started">Not Started</option>
                <option value="ongoing">Ongoing</option>
                <option value="finished">Finished</option>
                <option value="canceled">Canceled</option>
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="description">Description</label>
              <textarea id="description" name="description" value={classData.description} onChange={handleInputChange} rows="4" />
            </div>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.addAnother} onClick={() => router.push('/admin/classes/add')}>
              <span className={styles.plusIcon}>+</span> Add another
            </button>
            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? 'Updating...' : 'Update class'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

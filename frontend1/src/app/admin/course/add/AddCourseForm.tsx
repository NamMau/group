'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './add.module.css';
import { courseService } from '../../../../services/courseService';

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
      name: formData.get('courseName') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as
        | 'Web Development'
        | 'Frontend'
        | 'JavaScript'
        | 'Python'
        | 'UI/UX'
        | 'React'
        | 'Bootstrap',
      level: formData.get('level') as 'Beginner' | 'Intermediate' | 'Advanced',
      startDate: new Date(formData.get('startDate') as string),
      endDate: new Date(formData.get('endDate') as string),
      status: (formData.get('status') as string).toLowerCase().replace(/\s/g, '_') as
        | 'not_started'
        | 'ongoing'
        | 'finished'
        | 'canceled',
    };
  
    try {
      await courseService.createCourse(courseData);
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
          <label htmlFor="courseName">Course Name</label>
          <input type="text" id="courseName" name="courseName" placeholder="Name Course" className={styles.input} required />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" placeholder="Description" className={styles.input} rows={4} required />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="category">Category</label>
            <select id="category" name="category" className={styles.input} required>
              <option value="">Select Category</option>
              <option value="Web Development">Web Development</option>
              <option value="Frontend">Frontend</option>
              <option value="JavaScript">JavaScript</option>
              <option value="Python">Python</option>
              <option value="UI/UX">UI/UX</option>
              <option value="React">React</option>
              <option value="Bootstrap">Bootstrap</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="level">Level</label>
            <select id="level" name="level" className={styles.input} required>
              <option value="">Select Level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="startDate">Start Date</label>
            <input type="date" id="startDate" name="startDate" className={styles.input} required />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="endDate">End Date</label>
            <input type="date" id="endDate" name="endDate" className={styles.input} required />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="status">Status</label>
          <select id="status" name="status" className={styles.input} required>
            <option value="">Select Status</option>
            <option value="Not Started">Not Started</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Finished">Finished</option>
            <option value="Canceled">Canceled</option>
          </select>
        </div>

        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.addButton} disabled={loading}>
            {loading ? 'Adding...' : 'Add Course'}
          </button>
          <button type="reset" className={styles.addAnotherButton} onClick={handleAddAnother}>
            Add Another
          </button>
        </div>
      </form>
    </div>
  );
}

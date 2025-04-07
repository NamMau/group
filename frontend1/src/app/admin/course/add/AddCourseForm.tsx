'use client';

import { useRouter } from 'next/navigation';
import styles from './add.module.css';

export default function AddCourseForm() {
  const router = useRouter();

  // Xử lý khi nhấn nút "Add Course"
  const handleAddCourse = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert('Course added successfully!');
    router.push('/admin/course'); // Chuyển hướng về trang danh sách sau khi thêm
  };

  // Xử lý khi nhấn nút "Add another"
  const handleAddAnother = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    alert('Add another course');
    // Reset form
    e.currentTarget.form?.reset();
  };

  return (
    <div className={styles.addCourse}>
      <h1 className={styles.title}>Add Course</h1>
      <p className={styles.subtitle}>Manually</p>

      <form className={styles.form} onSubmit={handleAddCourse}>
        <div className={styles.formGroup}>
          <label htmlFor="courseName">Name Course</label>
          <input
            type="text"
            id="courseName"
            name="courseName"
            placeholder="Name Course"
            className={styles.input}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            placeholder="Description"
            className={styles.input}
            rows={4}
            required
          />
        </div>

        <div className={styles.buttonGroup}>
          <button type="button" className={styles.addAnotherButton} onClick={handleAddAnother}>
            <span className={styles.plusIcon}>+</span> Add another
          </button>
          <button type="submit" className={styles.addCourseButton}>
            Add Course
          </button>
        </div>
      </form>
    </div>
  );
}
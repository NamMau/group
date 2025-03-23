'use client';

import { useRouter } from 'next/navigation';
import styles from './add.module.css';

export default function AddClassForm() {
  const router = useRouter();

  // Xử lý khi nhấn nút "Add Class"
  const handleAddClass = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert('Class added successfully!');
    router.push('/admin/classes'); // Chuyển hướng về trang danh sách sau khi thêm
  };

  // Xử lý khi nhấn nút "Add another"
  const handleAddAnother = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    alert('Add another class');
    // Reset form
    e.currentTarget.form?.reset();
  };

  // Đặt giá trị mặc định cho Created Date
  const defaultCreatedDate = "13/02/2025 10:26 AM";

  return (
    <div className={styles.addClass}>
      <h1 className={styles.title}>Add Classes</h1>

      <form className={styles.form} onSubmit={handleAddClass}>
        {/* Hàng 1: 4 cột */}
        <div className={styles.formRowFourColumns}>
          <div className={styles.formGroup}>
            <label htmlFor="createdDate">Created Date</label>
            <input
              type="text"
              id="createdDate"
              name="createdDate"
              value={defaultCreatedDate}
              className={styles.input}
              readOnly
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="endDate">End Date</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="numberOfStudents">Number of students</label>
            <input
              type="number"
              id="numberOfStudents"
              name="numberOfStudents"
              placeholder="Number of students"
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="maximum">Maximum</label>
            <input
              type="number"
              id="maximum"
              name="maximum"
              placeholder="Maximum"
              className={styles.input}
              required
            />
          </div>
        </div>

        {/* Hàng 2: 2 cột */}
        <div className={styles.formRow}>
          {/* Cột trái */}
          <div className={styles.formColumn}>
            <div className={styles.formGroup}>
              <label htmlFor="className">Name Class</label>
              <input
                type="text"
                id="className"
                name="className"
                placeholder="Name Class"
                className={styles.input}
                required
              />
            </div>
          </div>

          {/* Cột phải */}
          <div className={styles.formColumn}>
            <div className={styles.formGroup}>
              <label htmlFor="teacher">Teacher</label>
              <select id="teacher" name="teacher" className={styles.input} required>
                <option value="">Select Teacher</option>
                <option value="teacher1">Teacher 1</option>
                <option value="teacher2">Teacher 2</option>
                <option value="teacher3">Teacher 3</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="course">Course</label>
              <select id="course" name="course" className={styles.input} required>
                <option value="">Select Course</option>
                <option value="course1">Course 1</option>
                <option value="course2">Course 2</option>
                <option value="course3">Course 3</option>
              </select>
            </div>
          </div>
        </div>

        {/* Hàng 3: Description (chiếm toàn bộ chiều rộng) */}
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
          <button type="submit" className={styles.addClassButton}>
            Add Class
          </button>
        </div>
      </form>
    </div>
  );
}
'use client';

import { useRouter } from 'next/navigation';
import styles from './add.module.css';

export default function AddStudentForm() {
  const router = useRouter();

  // Xử lý khi nhấn nút "Add Student"
  const handleAddStudent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert('Student added successfully!');
    router.push('/admin/students'); // Chuyển hướng về trang danh sách sau khi thêm
  };

  // Xử lý khi nhấn nút "Add another"
  const handleAddAnother = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    alert('Add another student');
    // Reset form
    e.currentTarget.form?.reset();
  };

  return (
    <div className={styles.addStudent}>
      <h1 className={styles.title}>Add Students</h1>
      <p className={styles.subtitle}>Manually</p>

      <form className={styles.form} onSubmit={handleAddStudent}>
        <div className={styles.formRow}>
          {/* Cột trái */}
          <div className={styles.formColumn}>
            <div className={styles.formGroup}>
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="Full Name"
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="studentId">Student ID</label>
              <input
                type="text"
                id="studentId"
                name="studentId"
                placeholder="Student ID"
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email address"
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="class">Class</label>
              <select id="class" name="class" className={styles.input} required>
                <option value="">Class</option>
                <option value="classA">Class A</option>
                <option value="classB">Class B</option>
                <option value="classC">Class C</option>
              </select>
            </div>
          </div>

          {/* Cột phải */}
          <div className={styles.formColumn}>
            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phone">Phone number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="Phone number"
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="avatar">Avatar</label>
              <div className={styles.avatarInput}>
                <input
                  type="file"
                  id="avatar"
                  name="avatar"
                  accept="image/*"
                  className={styles.fileInput}
                />
                <button type="button" className={styles.selectPhotoButton}>
                  Select photo
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <button type="button" className={styles.addAnotherButton} onClick={handleAddAnother}>
            <span className={styles.plusIcon}>+</span> Add another
          </button>
          <button type="submit" className={styles.addStudentButton}>
            Add Student
          </button>
        </div>
      </form>
    </div>
  );
}
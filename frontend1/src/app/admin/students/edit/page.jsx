'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './edit.module.css';

export default function EditStudent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const studentId = searchParams.get('studentId');

  const [student, setStudent] = useState({
    id: '',
    name: '',
    class: '',
    email: '',
    phone: '',
    avatar: '',
    password: '',
  });

  useEffect(() => {
    if (studentId) {
      const mockStudents = [
        { id: '1', name: 'Kristen Watson', class: 'Class A', email: 'michelle.rivera@example.com', phone: '123-456-7890', avatar: '', password: 'password123' },
        { id: '2', name: 'John Doe', class: 'Class B', email: 'john.doe@example.com', phone: '987-654-3210', avatar: '', password: 'password456' },
      ];
      const foundStudent = mockStudents.find((s) => s.id === studentId);
      if (foundStudent) {
        setStudent(foundStudent);
      } else {
        alert('Student not found!');
        router.push('/admin/students');
      }
    }
  }, [studentId, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStudent((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Updated student:', student);
    alert('Student updated successfully!');
    router.push('/admin/students');
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>Edit Student</h1>
        <h2 className={styles.subtitle}>MANUALLY</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Hàng 1: Name, Class, Password */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={student.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="class">Class</label>
              <select
                id="class"
                name="class"
                value={student.class}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a class</option>
                <option value="Class A">Class A</option>
                <option value="Class B">Class B</option>
                <option value="Class C">Class C</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={student.password}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Hàng 2: Email address, Phone number */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={student.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="phone">Phone number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={student.phone}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Hàng 3: Avatar */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="avatar">Avatar</label>
              <input
                type="file"
                id="avatar"
                name="avatar"
                accept="image/*"
                onChange={handleFileChange}
                className={styles.fileInput}
              />
              <label htmlFor="avatar" className={styles.fileLabel}>
                Select photo
              </label>
            </div>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.addAnother} onClick={() => router.push('/admin/students/add')}>
              <span className={styles.plusIcon}>+</span> Add another
            </button>
            <button type="submit" className={styles.submitButton}>
              Update student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
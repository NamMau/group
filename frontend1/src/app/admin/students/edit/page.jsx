'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './edit.module.css';
import { userService } from '../../../../services/userService';
import { authService } from '../../../../services/authService';

export default function EditStudent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const studentId = searchParams.get('studentId');

  const [student, setStudent] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    department: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchStudent = async () => {
      if (!studentId) return;

      const user = authService.getUser();
      const token = user?.token;

      if (!user || !token) {
        router.push('/admin/login');
        return;
      }

      try {
        const data = await userService.getStudents(studentId, token);
        setStudent({
          fullName: data.fullName || '',
          email: data.email || '',
          phoneNumber: data.phoneNumber || '',
          password: '',
          department: data.department || '',
        });
      } catch (err) {
        setError(err.message || 'Error fetching student data');
        if (err.message === 'Unauthorized access') {
          authService.removeToken();
          router.push('/admin/login');
        } else {
          setTimeout(() => router.push('/admin/students'), 2000);
        }
      }
    };

    fetchStudent();
  }, [studentId, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudent((prev) => ({ ...prev, [name]: value || '' }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const user = authService.getUser();
    const token = user?.token;

    if (!user || !token) {
      router.push('/admin/login');
      return;
    }

    try {
      const studentData = {
        ...student,
        password: student.password || undefined,
      };

      await userService.updateUser(studentId, studentData, token);
      setSuccess('Student updated successfully!');
      setTimeout(() => router.push('/admin/students'), 1000);
    } catch (err) {
      setError(err.message);
      if (err.message === 'Unauthorized access') {
        authService.removeToken();
        router.push('/admin/login');
      }
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>Edit Student</h1>
        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={student.fullName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={student.password}
                onChange={handleInputChange}
                placeholder="Leave empty to keep current password"
              />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
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
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={student.phoneNumber}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="department">Department</label>
              <select
                id="department"
                name="department"
                value={student.department}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a department</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Software Engineering">Software Engineering</option>
                <option value="Artificial Intelligence">Artificial Intelligence</option>
                <option value="Data Science">Data Science</option>
              </select>
            </div>
          </div>
          <div className={styles.actions}>
            <button type="submit" className={styles.submitButton}>
              Update student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

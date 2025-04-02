'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './add.module.css';

export default function AddStudentForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication token is missing. Please log in again.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/v1/auth/register/student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to register student');
      }

      setSuccess('Student added successfully!');
      setFormData({ fullName: '', email: '', password: '', phoneNumber: '' });
      router.push('/admin/students');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.addStudent}>
      <h1 className={styles.title}>Add Student</h1>
      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="fullName">Full Name</label>
          <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required className={styles.input} />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className={styles.input} />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required className={styles.input} />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="phoneNumber">Phone Number</label>
          <input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required className={styles.input} />
        </div>

        <button type="submit" className={styles.addStudentButton}>Add Student</button>
      </form>
    </div>
  );
}

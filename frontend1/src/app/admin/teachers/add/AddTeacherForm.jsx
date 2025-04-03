'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './add.module.css';
import { authService, API_URL } from '../../../../services/authService';

export default function AddTeacherForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'tutor',
    phoneNumber: '',
    department: '',
    // avatar: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, avatar: e.target.files[0] });
  };

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!authService.isAuthenticated()) {
      setError('Unauthorized. Please log in.');
      router.push('/admin/login');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/register/tutor`, {
        method: 'POST',
        headers: {
          ...authService.getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Teacher added successfully!');
        router.push('/admin/teachers');
      } else {
        if (response.status === 401) {
          authService.removeToken();
          router.push('/admin/login');
        }
        throw new Error(data.message || 'Failed to add teacher');
      }
    } catch (error) {
      console.error('Error adding teacher:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.addTeacher}>
      <h1 className={styles.title}>Add Teachers</h1>
      <p className={styles.subtitle}>Manually</p>

      {error && <div className={styles.error}>{error}</div>}

      <form className={styles.form} onSubmit={handleAddTeacher}>
        <div className={styles.formGroup}>
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            placeholder="Full Name"
            className={styles.input}
            value={formData.fullName}
            onChange={handleChange}
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
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            className={styles.input}
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="phoneNumber">Phone number</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            placeholder="Phone number"
            className={styles.input}
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="department">Department</label>
          <input
            type="text"
            id="department"
            name="department"
            placeholder="Department"
            className={styles.input}
            value={formData.department}
            onChange={handleChange}
            required
          />
        </div>

        {/* <div className={styles.formGroup}>
          <label htmlFor="avatar">Avatar</label>
          <div className={styles.avatarInput}>
            <input
              type="file"
              id="avatar"
              name="avatar"
              accept="image/*"
              className={styles.fileInput}
              onChange={handleFileChange}
            />
            <button type="button" className={styles.selectPhotoButton}>
              Select photo
            </button>
          </div>
        </div> */}

        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.addTeacherButton} disabled={loading}>
            {loading ? 'Adding...' : 'Add Teacher'}
          </button>
        </div>
      </form>
    </div>
  );
}

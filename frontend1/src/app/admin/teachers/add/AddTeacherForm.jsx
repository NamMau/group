'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './add.module.css';

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

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Unauthorized. Please log in.');
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    try {
      const response = await fetch('http://localhost:5000/api/auth/register/tutor', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        alert('Teacher added successfully!');
        router.push('/admin/teachers');
      } else {
        const data = await response.json();
        alert(`Failed to add teacher: ${data.message}`);
      }
    } catch (error) {
      console.error('Error adding teacher:', error);
      alert('Error adding teacher');
    }

    setLoading(false);
  };

  return (
    <div className={styles.addTeacher}>
      <h1 className={styles.title}>Add Teachers</h1>
      <p className={styles.subtitle}>Manually</p>

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

'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from './edit.module.css';

export default function EditTeacherForm({ tutorId }: { tutorId: string }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'tutor',
    phoneNumber: '',
    department: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTeacher = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Unauthorized. Please log in.');
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/users/${tutorId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setFormData(data);
        } else {
          alert('Failed to fetch teacher details');
        }
      } catch (error) {
        console.error('Error fetching teacher:', error);
        alert('Error fetching teacher');
      }
    };

    if (tutorId) {
      fetchTeacher();
    }
  }, [tutorId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveChanges = async (e: React.FormEvent<HTMLFormElement>) => {
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
      formDataToSend.append(key, value as string);
    });

    try {
      const response = await fetch(`http://localhost:5000/api/users/update-user/${tutorId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        alert('Teacher updated successfully!');
        router.push('/admin/teachers');
      } else {
        const data = await response.json();
        alert(`Failed to update teacher: ${data.message}`);
      }
    } catch (error) {
      console.error('Error updating teacher:', error);
      alert('Error updating teacher');
    }

    setLoading(false);
  };

  return (
    <div className={styles.editTeacher}>
      <h1 className={styles.title}>Edit Teacher</h1>
      <p className={styles.subtitle}>Manually</p>

      <form className={styles.form} onSubmit={handleSaveChanges}>
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

        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.saveButton} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

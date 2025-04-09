'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './add.module.css';
import { userService } from '../../../../services/userService'; // Import from userService

export default function AddTutorForm() {
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
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddTutor = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await userService.createTutor(formData); // Use userService.createTutor
      alert('Tutor added successfully!');
      router.push('/admin/teachers');
    } catch (error) {
      console.error('Error adding tutor:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.addTutor}>
      <h1 className={styles.title}>Add Tutor</h1>
      {error && <p className={styles.error}>{error}</p>}

      <form className={styles.form} onSubmit={handleAddTutor}>
        <div className={styles.formGroup}>
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="department">Department</label>
          <select
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            className={styles.input}
            required
          >
            <option value="">Select Department</option>
            <option value="computer_science">Computer Science</option>
            <option value="design">Design</option>
            <option value="business">Business</option>
            <option value="marketing">Marketing</option>
          </select>
        </div>

        <div className={styles.buttonGroup}>
          <button
            type="submit"
            className={styles.addButton}
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Tutor'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/teachers')}
            className={styles.cancelButton}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
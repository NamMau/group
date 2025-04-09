'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from './edit.module.css';
import { userService, UpdateUserData } from '../../../../services/userService';

interface FormData extends UpdateUserData {
  role: string;
}

export default function EditTutorForm({ tutorId }: { tutorId: string }) {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    password: '',
    role: 'tutor',
    phoneNumber: '',
    department: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        setLoading(true);
        const data = await userService.getUser(tutorId);
        setFormData({
          fullName: data.fullName || '',
          email: data.email || '',
          password: '',
          role: data.role || 'tutor',
          phoneNumber: data.phoneNumber || '',
          department: data.department || '',
        });
      } catch (error) {
        console.error('Error fetching tutor:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch tutor');
        alert('Error fetching tutor details');
      } finally {
        setLoading(false);
      }
    };

    if (tutorId) {
      fetchTutor();
    }
  }, [tutorId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Only send password if it's not empty
      const updateData: UpdateUserData = {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        department: formData.department,
        ...(formData.password ? { password: formData.password } : {})
      };

      await userService.updateUser(tutorId, updateData);
      alert('Tutor updated successfully!');
      router.push('/admin/teachers');
    } catch (error) {
      console.error('Error updating tutor:', error);
      setError(error instanceof Error ? error.message : 'Failed to update tutor');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.editTutor}>
      <h1 className={styles.title}>Edit Tutor</h1>
      {error && <p className={styles.error}>{error}</p>}
      
      <form className={styles.form} onSubmit={handleSubmit}>
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
          <label htmlFor="password">New Password (optional)</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            value={formData.password}
            onChange={handleChange}
            className={styles.input}
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
            className={styles.saveButton} 
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
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

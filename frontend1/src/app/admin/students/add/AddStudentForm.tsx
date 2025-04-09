'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './add.module.css';
import { userService, Tutor } from '../../../../services/userService';
import { authService } from '../../../../services/authService';
import Image from 'next/image';
import axios from 'axios';

export default function AddStudentForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
    personalTutor: '',
    department: '',
    avatar: ''
  });
  const [avatarPreview, setAvatarPreview] = useState('');
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        setLoading(true);
        
        // Check if user is authenticated
        if (!authService.isAuthenticated()) {
          console.log('Not authenticated, redirecting to login');
          router.push('/admin/login');
          return;
        }

        const token = authService.getToken();
        if (!token) {
          console.log('No token found, redirecting to login');
          router.push('/admin/login');
          return;
        }

        console.log('Fetching tutors...');
        const tutorsData = await userService.getTutors();
        console.log('Fetched tutors:', tutorsData);
        setTutors(tutorsData);
      } catch (err) {
        console.error('Error fetching tutors:', err);
        if (err instanceof Error && err.message.includes('Authentication')) {
          console.log('Authentication error, redirecting to login');
          router.push('/admin/login');
        } else {
          setError(err instanceof Error ? err.message : 'Failed to fetch tutors');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Tạo URL cho preview
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);

      // Đọc file như base64 string
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          avatar: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!authService.isAuthenticated()) {
      console.log('Not authenticated, redirecting to login');
      router.push('/admin/login');
      return;
    }

    const token = authService.getToken();
    if (!token) {
      console.log('No token found, redirecting to login');
      router.push('/admin/login');
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register/student`,
        formData,
        {
          headers: authService.getAuthHeaders()
        }
      );

      if (response.status === 401) {
        authService.removeToken();
        router.push('/admin/login');
        return;
      }

      setSuccess('Student added successfully!');
      setFormData({
        fullName: '',
        email: '',
        password: '',
        phoneNumber: '',
        personalTutor: '',
        department: '',
        avatar: ''
      });
      setAvatarPreview('');
      router.push('/admin/students');
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Failed to register student');
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading tutors...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.addStudent}>
      <h1 className={styles.title}>Add Student</h1>
      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="avatar">Avatar</label>
          <div className={styles.avatarUpload}>
            <div className={styles.avatarPreview}>
              {avatarPreview ? (
                <Image
                  src={avatarPreview}
                  alt="Avatar preview"
                  width={100}
                  height={100}
                  className={styles.avatarImage}
                />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  No image selected
                </div>
              )}
            </div>
            <input
              type="file"
              id="avatar"
              name="avatar"
              accept="image/*"
              onChange={handleAvatarChange}
              className={styles.fileInput}
            />
            <label htmlFor="avatar" className={styles.fileLabel}>
              Choose Image
            </label>
          </div>
        </div>

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

        <div className={styles.formGroup}>
          <label htmlFor="department">Department</label>
          <select 
            id="department" 
            name="department" 
            value={formData.department} 
            onChange={handleChange} 
            required 
            className={styles.input}
          >
            <option value="">Select a department</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Software Engineering">Software Engineering</option>
            <option value="Artificial Intelligence">Artificial Intelligence</option>
            <option value="Data Science">Data Science</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="personalTutor">Personal Tutor (Optional)</label>
          <select 
            id="personalTutor" 
            name="personalTutor" 
            value={formData.personalTutor} 
            onChange={handleChange} 
            className={styles.input}
          >
            <option value="">Select a tutor</option>
            {tutors && tutors.length > 0 ? (
              tutors.map((tutor) => (
                <option key={tutor._id} value={tutor._id}>
                  {tutor.fullName} ({tutor.email})
                </option>
              ))
            ) : (
              <option value="" disabled>No tutors available</option>
            )}
          </select>
        </div>

        <button type="submit" className={styles.addStudentButton}>Add Student</button>
      </form>
    </div>
  );
}

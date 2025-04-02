'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './add.module.css';

interface ClassFormData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  quantity: number;
  tutor: string;
  courses: string[];
}

export default function AddClassForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<ClassFormData>({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    quantity: 0,
    tutor: '',
    courses: []
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [courses, setCourses] = useState<{ _id: string; name: string }[]>([]);
  const [tutors, setTutors] = useState<{ _id: string; fullName: string }[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [coursesRes, tutorsRes] = await Promise.all([
          fetch('http://localhost:5000/api/v1/courses/create-course'),
          fetch('http://localhost:5000/api/v1/users/get-tutors')
        ]);
        if (!coursesRes.ok || !tutorsRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const coursesData = await coursesRes.json();
        const tutorsData = await tutorsRes.json();
        
        setCourses(coursesData);
        setTutors(tutorsData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch courses or tutors');
      }
    }
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'quantity' ? Number(value) : value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({ ...prev, courses: options }));
  };

  const handleAddClass = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3000/api/v1/classes/create-class', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create class');
      }
      
      alert('Class added successfully!');
      router.push('/admin/classes');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.addClass}>
      <h1 className={styles.title}>Add Class</h1>
      {error && <p className={styles.error}>{error}</p>}
      
      <form className={styles.form} onSubmit={handleAddClass}>
        <div className={styles.formRowFourColumns}>
          <div className={styles.formGroup}>
            <label htmlFor="startDate">Start Date</label>
            <input type="date" id="startDate" name="startDate" className={styles.input} required onChange={handleChange} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="endDate">End Date</label>
            <input type="date" id="endDate" name="endDate" className={styles.input} required onChange={handleChange} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="quantity">Quantity</label>
            <input type="number" id="quantity" name="quantity" className={styles.input} required onChange={handleChange} />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formColumn}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Class Name</label>
              <input type="text" id="name" name="name" className={styles.input} required onChange={handleChange} />
            </div>
          </div>

          <div className={styles.formColumn}>
            <div className={styles.formGroup}>
              <label htmlFor="tutor">Tutor</label>
              <select id="tutor" name="tutor" className={styles.input} required onChange={handleChange}>
                <option value="">Select Tutor</option>
                {tutors.map((tutor) => (
                  <option key={tutor._id} value={tutor._id}>{tutor.fullName}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="courses">Courses</label>
              <select id="courses" name="courses" className={styles.input} required multiple onChange={handleSelectChange}>
                <option value="">Select Courses</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>{course.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" className={styles.input} rows={4} required onChange={handleChange} />
        </div>

        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.addClassButton} disabled={loading}>
            {loading ? 'Adding...' : 'Add Class'}
          </button>
        </div>
      </form>
    </div>
  );
}

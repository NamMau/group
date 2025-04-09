'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { classService } from '../../../../services/classService';
import { userService, Tutor as TutorType } from '../../../../services/userService'; // Import userService and Tutor type
import { courseService, Course as CourseType } from '../../../../services/courseService'; // Import courseService and Course type
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

interface AvailableTutor extends TutorType {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  // Add other properties from TutorType if necessary
}

interface AvailableCourse extends CourseType {
  _id: string;
  name: string;
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
  }); // Corrected: useState only accepts one argument (initial state)
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [courses, setCourses] = useState<AvailableCourse[]>([]);
  const [tutors, setTutors] = useState<AvailableTutor[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const coursesData = await courseService.getAllCourses(); // Fetch courses using courseService
        const tutorsData = await userService.getTutors(); // Fetch tutors using userService

        // Directly assign the fetched data if the types are compatible
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
    let newValue = value;
    if (name === 'quantity') {
      const parsedValue = Number(value);
      if (parsedValue > 18) {
        newValue = '18';
      } else if (parsedValue < 0) {
        newValue = '0';
      } else {
        newValue = parsedValue.toString();
      }
    }
    setFormData((prev) => ({ ...prev, [name]: newValue }));
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
      await classService.createClass(formData);
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
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              className={styles.input}
              required
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="endDate">End Date</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              className={styles.input}
              required
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="quantity">Quantity</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              min="0" // Ensure minimum is 0
              max="18" // Set the maximum limit to 18
              className={styles.input}
              required
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formColumn}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Class Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                className={styles.input}
                required
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.formColumn}>
            <div className={styles.formGroup}>
              <label htmlFor="tutor">Tutor</label>
              <select
                id="tutor"
                name="tutor"
                value={formData.tutor}
                className={`${styles.input} ${styles.select}`}
                required
                onChange={handleChange}
              >
                <option value="">Select Tutor</option>
                {tutors.map((tutor) => (
                  <option key={tutor._id} value={tutor._id}>{tutor.fullName}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="courses">Courses (Multiple Selection)</label>
              <select
                id="courses"
                name="courses"
                multiple
                size={4}
                className={`${styles.input} ${styles.select}`}
                required
                onChange={handleSelectChange}
                value={formData.courses}
              >
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>{course.name}</option>
                ))}
              </select>
              <small className={styles.helperText}>Hold Ctrl/Cmd to select multiple courses</small>
            </div>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            className={styles.input}
            rows={4}
            required
            onChange={handleChange}
          />
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
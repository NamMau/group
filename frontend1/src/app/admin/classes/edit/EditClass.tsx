'use client';

import { useState, useEffect } from 'react';
import React from 'react'; 
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './edit.module.css';
import { classService, Class } from '../../../../services/classService'; // Import named exports
import { userService } from '../../../../services/userService';
import { courseService } from '../../../../services/courseService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';

interface AvailableTutor {
  _id: string;
  fullName: string;
}

interface AvailableCourse {
  _id: string;
  name: string;
}

interface AvailableStudent {
  _id: string;
  fullName: string;
}

interface EditClassProps {
  classId: string;
}

interface ClassFormData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  quantity: number;
  tutor: string;
  students: string[];
  courses: string[];
  status: 'not_started' | 'ongoing' | 'finished' | 'canceled';
}

export default function EditClass({ classId }: EditClassProps) {
  const router = useRouter();
  // const searchParams = useSearchParams();
  // const classId = searchParams.get('classId');

  const [classData, setClassData] = useState<ClassFormData>({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    quantity: 0,
    tutor: '',
    students: [],
    courses: [],
    status: 'not_started'
  });
  const [availableTutors, setAvailableTutors] = useState<AvailableTutor[]>([]);
  const [availableCourses, setAvailableCourses] = useState<AvailableCourse[]>([]);
  const [availableStudents, setAvailableStudents] = useState<AvailableStudent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEditData() {
      if (classId) {
        setLoading(true);
        setError(null);
        try {
          // Fetch the current class data first
          const currentClass = await classService.getClassById(classId);
          if (currentClass) {
            // Transform the data to match our form structure
            setClassData({
              name: currentClass.name,
              description: currentClass.description,
              startDate: currentClass.startDate,
              endDate: currentClass.endDate,
              quantity: currentClass.quantity,
              tutor: currentClass.tutor._id,
              students: currentClass.students.map(student => student._id),
              courses: currentClass.courses.map(course => course._id),
              status: currentClass.status || 'not_started'
            });
          }

          // Fetch available options
          const [tutors, courses, students] = await Promise.all([
            userService.getTutors(),
            courseService.getAllCourses(),
            userService.getStudents()
          ]);

          setAvailableTutors(tutors);
          setAvailableCourses(courses);
          setAvailableStudents(students);
        } catch (err: any) {
          setError(err.message || 'Failed to fetch data');
          toast.error('Failed to fetch class data!');
          router.push('/admin/classes');
        } finally {
          setLoading(false);
        }
      }
    }

    fetchEditData();
  }, [classId, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | { target: { name: string; value: string | string[] } }) => {
    const { name, value } = e.target;
    setClassData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const updatedClass = await classService.updateClass(classId, classData);
      if (updatedClass) {
        toast.success('Class updated successfully');
        router.push('/admin/classes');
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Failed to update class');
      toast.error(error.message || 'Failed to update class');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading class data...</div>;
  }

  if (error || !classData) {
    return <div>Error: {error || 'Could not load class data.'}</div>;
  }

  return (
    <div className={styles.pageWrapper}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className={styles.container}>
        <h1 className={styles.title}>Edit Class</h1>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="startDate">Start Date</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={classData?.startDate || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="endDate">End Date</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={classData?.endDate || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="quantity">Number of Students</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={classData?.quantity?.toString() || ''}
                onChange={handleInputChange}
                min={1}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Class Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={classData?.name || ''}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <FormControl fullWidth>
                <InputLabel id="tutor-label">Tutor</InputLabel>
                <Select
                  labelId="tutor-label"
                  id="tutor"
                  name="tutor"
                  value={classData?.tutor || ''}
                  onChange={handleInputChange}
                  required
                  label="Tutor"
                >
                  {availableTutors.map((tutor) => (
                    <MenuItem key={tutor._id} value={tutor._id}>
                      {tutor.fullName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className={styles.formGroup}>
              <FormControl fullWidth>
                <InputLabel id="courses-label">Courses</InputLabel>
                <Select
                  labelId="courses-label"
                  id="courses"
                  name="courses"
                  multiple
                  value={classData?.courses || []}
                  onChange={handleInputChange}
                  required
                  label="Courses"
                >
                  {availableCourses.map((course) => (
                    <MenuItem key={course._id} value={course._id}>
                      {course.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Select multiple courses if needed</FormHelperText>
              </FormControl>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <FormControl fullWidth>
                <InputLabel id="students-label">Students</InputLabel>
                <Select
                  labelId="students-label"
                  id="students"
                  name="students"
                  multiple
                  value={classData?.students || []}
                  onChange={handleInputChange}
                  required
                  label="Students"
                >
                  {availableStudents.map((student) => (
                    <MenuItem key={student._id} value={student._id}>
                      {student.fullName}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Select multiple students if needed</FormHelperText>
              </FormControl>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <FormControl fullWidth>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  id="status"
                  name="status"
                  value={classData?.status || ''}
                  onChange={handleInputChange}
                  label="Status"
                >
                  <MenuItem value="not_started">Not Started</MenuItem>
                  <MenuItem value="ongoing">Ongoing</MenuItem>
                  <MenuItem value="finished">Finished</MenuItem>
                  <MenuItem value="canceled">Canceled</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={classData?.description || ''}
                onChange={handleInputChange}
                rows={4}
              />
            </div>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.addAnother}
              onClick={() => router.push('/admin/classes/add')}
            >
              <span className={styles.plusIcon}>+</span> Add another
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update class'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
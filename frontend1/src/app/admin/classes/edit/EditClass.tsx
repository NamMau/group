  'use client';

  import { useState, useEffect } from 'react';
  import React from 'react'; 
  import { useRouter, useSearchParams } from 'next/navigation';
  import styles from './edit.module.css';
  import { classService, Class } from '../../../../services/classService'; // Import named exports
  import { userService } from '../../../../services/userService';
  import { courseService } from '../../../../services/courseService';

  interface AvailableTutor {
    _id: string;
    fullName: string;
  }

  interface AvailableCourse {
    _id: string;
    name: string;
  }

  interface EditClassProps {
    classId: string;
  }

  export default function EditClass({ classId }: EditClassProps) {
    const router = useRouter();
    // const searchParams = useSearchParams();
    // const classId = searchParams.get('classId');

    const [classData, setClassData] = useState<Class | null>(null);
    const [availableTutors, setAvailableTutors] = useState<AvailableTutor[]>([]);
    const [availableCourses, setAvailableCourses] = useState<AvailableCourse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      async function fetchEditData() {
        if (classId) {
          setLoading(true);
          setError(null);
          try {
            const fetchedClass = await classService.getClassById(classId);
            const tutors = await userService.getTutors();
            const courses = await courseService.getAllCourses();

            if (fetchedClass) {
              setClassData(fetchedClass);
            } else {
              setError('Class not found!');
              alert('Class not found!');
              router.push('/admin/classes');
              return;
            }
            setAvailableTutors(tutors);
            setAvailableCourses(courses);
          } catch (err: any) {
            setError(err.message || 'Failed to fetch data');
            alert('Failed to fetch class data!');
            router.push('/admin/classes');
          } finally {
            setLoading(false);
          }
        }
      }

      fetchEditData();
    }, [classId, router]);

    const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      const { name, value } = e.target;
      
      // Xử lý đặc biệt cho select multiple (courses)
      if (name === 'courses' && e.target instanceof HTMLSelectElement && e.target.multiple) {
        const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
        setClassData((prev: Class | null) => prev ? { ...prev, [name]: selectedOptions } : null);
        return;
      }

      if (name === 'quantity') {
        let valueAsNumber = parseInt(value, 10);
        if (valueAsNumber > 18) {
          valueAsNumber = 18;
        }
        setClassData((prev) => prev ? { ...prev, quantity: valueAsNumber } : null);
        return;
      }      
      
      setClassData((prev: Class | null) => prev ? { ...prev, [name]: value } : null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
      if (classData && classId) {
        try {
          const updatePayload = {
            name: classData.name,
            description: classData.description,
            startDate: classData.startDate,
            endDate: classData.endDate,
            tutor: classData.tutor,
            courses: classData.courses,
            status: classData.status,
          };
          const updatedClass = await classService.updateClass(classId, updatePayload);
          if (updatedClass) {
            alert('Class updated successfully!');
            router.push('/admin/classes');
          } else {
            setError('Failed to update class');
            alert('Error updating class');
          }
        } catch (err: any) {
          setError(err.message || 'Failed to update class');
          alert('Error updating class');
        } finally {
          setLoading(false);
        }
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
                <label htmlFor="tutor">Tutor</label>
                <select
                  id="tutor"
                  name="tutor"
                  value={classData?.tutor || ''}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Tutor</option>
                  {availableTutors.map((tutor) => (
                    <option key={tutor._id} value={tutor._id}>
                      {tutor.fullName}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="courses">Courses</label>
                <select
                  id="courses"
                  name="courses"
                  value={Array.isArray(classData.courses) ? classData.courses : []}
                  onChange={handleInputChange}
                  required
                  multiple
                >
                  {availableCourses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={classData?.status || ''}
                  onChange={handleInputChange}
                >
                  <option value="not_started">Not Started</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="finished">Finished</option>
                  <option value="canceled">Canceled</option>
                </select>
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
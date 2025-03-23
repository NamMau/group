'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './edit.module.css';

export default function EditClass() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const classId = searchParams.get('classId');

  const [classData, setClassData] = useState({
    id: '',
    createdDate: '',
    endDate: '',
    numberOfStudents: '',
    name: '',
    teacher: '',
    course: '',
    description: '',
  });

  // Giả lập lấy dữ liệu lớp học dựa trên classId
  useEffect(() => {
    if (classId) {
      // Thay thế bằng API call thực tế
      const mockClasses = [
        {
          id: '1',
          createdDate: '13/03/2025 10:26 AM',
          endDate: '',
          numberOfStudents: '10',
          name: 'Class A',
          teacher: 'Kristen Watson',
          course: 'Mathematics',
          description: 'This is a mathematics class for grade 10 students.',
        },
        {
          id: '2',
          createdDate: '14/03/2025 09:15 AM',
          endDate: '',
          numberOfStudents: '15',
          name: 'Class B',
          teacher: 'John Doe',
          course: 'Physics',
          description: 'This is a physics class for grade 11 students.',
        },
      ];
      const foundClass = mockClasses.find((c) => c.id === classId);
      if (foundClass) {
        setClassData(foundClass);
      } else {
        alert('Class not found!');
        router.push('/admin/classes');
      }
    }
  }, [classId, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClassData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Thay thế bằng API call để cập nhật lớp học
    console.log('Updated class:', classData);
    alert('Class updated successfully!');
    router.push('/admin/classes');
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>Edit Classes</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Hàng 1: Created Date, End Date, Number of Students */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="createdDate">Created Date</label>
              <input
                type="text"
                id="createdDate"
                name="createdDate"
                value={classData.createdDate}
                onChange={handleInputChange}
                readOnly
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="endDate">End Date</label>
              <input
                type="text"
                id="endDate"
                name="endDate"
                value={classData.endDate}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="numberOfStudents">Number of students</label>
              <input
                type="number"
                id="numberOfStudents"
                name="numberOfStudents"
                value={classData.numberOfStudents}
                onChange={handleInputChange}
                readOnly
              />
            </div>
          </div>

          {/* Hàng 2: Name Class */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Name Class</label>
              <input
                type="text"
                id="name"
                name="name"
                value={classData.name}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Hàng 3: Name Teacher, Course */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="teacher">Name Teacher</label>
              <select
                id="teacher"
                name="teacher"
                value={classData.teacher}
                onChange={handleInputChange}
                required
              >
                <option value="">Select</option>
                <option value="Kristen Watson">Kristen Watson</option>
                <option value="John Doe">John Doe</option>
                <option value="Jane Smith">Jane Smith</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="course">Course</label>
              <select
                id="course"
                name="course"
                value={classData.course}
                onChange={handleInputChange}
                required
              >
                <option value="">Select</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
              </select>
            </div>
          </div>

          {/* Hàng 4: Description */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={classData.description}
                onChange={handleInputChange}
                rows="4"
              />
            </div>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.addAnother} onClick={() => router.push('/admin/classes/add')}>
              <span className={styles.plusIcon}>+</span> Add another
            </button>
            <button type="submit" className={styles.submitButton}>
              Update class
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
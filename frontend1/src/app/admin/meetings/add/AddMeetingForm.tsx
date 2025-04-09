'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './add.module.css';
import { meetingService } from '../../../../services/meetingService';
import { courseService } from '../../../../services/courseService';
import { userService } from '../../../../services/userService';
import { authService } from '../../../../services/authService';
import { toast } from 'react-hot-toast';

interface FormData {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  tutor: string;
  student: string;
  course?: string;
  meetingLink?: string;
}

export default function AddMeetingForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    tutor: '',
    student: '',
    course: '',
    meetingLink: ''
  });

  const [tutors, setTutors] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tutorsData, coursesData] = await Promise.all([
          userService.getTutors(),
          courseService.getAllCourses()
        ]);
        setTutors(tutorsData);
        setCourses(coursesData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load form data');
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = authService.getToken();
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      // Format dates to ISO string
      const meetingData = {
        ...formData,
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
      };

      await meetingService.createMeeting(meetingData);
      toast.success('Meeting created successfully');
      router.push('/admin/meetings');
    } catch (error) {
      console.error('Error creating meeting:', error);
      toast.error('Failed to create meeting');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          className={styles.textarea}
          rows={4}
        />
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="startTime">Start Time</label>
          <input
            type="datetime-local"
            id="startTime"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="endTime">End Time</label>
          <input
            type="datetime-local"
            id="endTime"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="tutor">Tutor</label>
        <select
          id="tutor"
          name="tutor"
          value={formData.tutor}
          onChange={handleChange}
          required
          className={styles.select}
        >
          <option value="">Select Tutor</option>
          {tutors.map(tutor => (
            <option key={tutor._id} value={tutor._id}>
              {tutor.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="student">Student</label>
        <select
          id="student"
          name="student"
          value={formData.student}
          onChange={handleChange}
          required
          className={styles.select}
        >
          <option value="">Select Student</option>
          {students.map(student => (
            <option key={student._id} value={student._id}>
              {student.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="course">Course (Optional)</label>
        <select
          id="course"
          name="course"
          value={formData.course}
          onChange={handleChange}
          className={styles.select}
        >
          <option value="">Select Course</option>
          {courses.map(course => (
            <option key={course._id} value={course._id}>
              {course.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="meetingLink">Meeting Link (Optional)</label>
        <input
          type="url"
          id="meetingLink"
          name="meetingLink"
          value={formData.meetingLink}
          onChange={handleChange}
          placeholder="https://meet.google.com/..."
          className={styles.input}
        />
      </div>

      <div className={styles.formActions}>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Meeting'}
        </button>
      </div>
    </form>
  );
} 
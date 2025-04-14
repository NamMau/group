'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './add.module.css';
import { meetingService, Meeting } from '../../../../services/meetingService';
import { courseService } from '../../../../services/courseService';
import { userService } from '../../../../services/userService';
import { classService } from '../../../../services/classService';
import { authService } from '../../../../services/authService';
import { toast } from 'react-hot-toast';

interface FormData {
  date: string;
  time: string;
  duration: number;
  tutor: string;
  student: string[];
  course?: string;
  meetingLink?: string;
  notes?: string;
  classId?: string;
}

interface Student {
  _id: string;
  fullName: string;
  email: string;
}

interface Course {
  _id: string;
  name: string;
}

export default function AddMeetingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const classId = searchParams.get('classId');

  const [formData, setFormData] = useState<FormData>({
    date: '',
    time: '',
    duration: 60, // Default duration 60 minutes
    tutor: '',
    student: [],
    course: '',
    meetingLink: '',
    notes: '',
    classId: classId || ''
  });

  const [tutors, setTutors] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [classData, setClassData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (classId) {
          // If creating from class, fetch class data
          const classDetails = await classService.getClassById(classId);
          if (classDetails) {
            setClassData(classDetails);
            setFormData(prev => ({
              ...prev,
              tutor: classDetails.tutor._id,
              course: classDetails.courses[0]?._id || '',
              student: classDetails.students.map((s: any) => s._id)
            }));
          }
        } else {
          // If not creating from class, fetch all data
          const [tutorsData, studentsData, coursesData] = await Promise.all([
            userService.getTutors(),
            userService.getStudents(),
            courseService.getAllCourses()
          ]);
          setTutors(tutorsData);
          setStudents(studentsData);
          setCourses(coursesData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load form data');
      }
    };

    fetchData();
  }, [classId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, multiple, options } = e.target as HTMLSelectElement;

    if (multiple) {
      const selectedValues = Array.from(options)
        .filter(option => option.selected)
        .map(option => option.value);
      setFormData(prev => ({
        ...prev,
        [name]: selectedValues
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    const { date, time, duration, tutor, student, course, meetingLink, notes } = formData;
  
    if (!date || !time || !classId) {
      toast.error('Please fill in all required fields');
      setLoading(false);
      return;
    }
  
    if (duration <= 0) {
      toast.error('Duration must be greater than 0');
      setLoading(false);
      return;
    }
  
    try {
      const token = authService.getToken();
      if (!token) {
        toast.error('Authentication required');
        return;
      }
  
      const dateObj = new Date(date);
      const [hour, minute] = time.split(':');
      const timeObj = new Date(date);
      timeObj.setHours(parseInt(hour), parseInt(minute), 0, 0);

      // Get full student objects
      const selectedStudents = students.filter(s => student.includes(s._id));
      
      // Get full course object
      const selectedCourse = courses.find(c => c._id === course);
      if (!selectedCourse && !classId) {
        toast.error('Please select a course');
        setLoading(false);
        return;
      }
  
      const meetingData: Meeting = {
        date: dateObj,
        time: time,
        duration: Number(duration),
        tutorId: tutor,
        students: selectedStudents.map(s => ({
          _id: s._id,
          fullName: s.fullName || s.email,
          email: s.email
        })),
        courseId: {
          _id: selectedCourse?._id || classData?.courses[0]?._id || '',
          name: selectedCourse?.name || classData?.courses[0]?.name || ''
        },
        classId: classId,
        meetingLink: meetingLink || undefined,
        notes: notes || undefined,
        status: 'scheduled'
      };
  
      console.log('Meeting data being sent:', meetingData);
      const result = await meetingService.createMeeting(meetingData);
      console.log('Meeting creation result:', result);
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
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="time">Time</label>
          <input
            type="time"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="duration">Duration (minutes)</label>
          <input
            type="number"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            min={1}
            required
            className={styles.input}
          />
        </div>
      </div>

      {!classId ? (
        <>
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
                  {tutor.fullName || tutor.email}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="student">Students</label>
            <select
              id="student"
              name="student"
              multiple
              value={formData.student}
              onChange={handleChange}
              required
              className={styles.select}
              size={5}
            >
              {students.map(student => (
                <option key={student._id} value={student._id}>
                  {student.fullName || student.email}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="course">Course</label>
            <select
              id="course"
              name="course"
              value={formData.course}
              onChange={handleChange}
              required
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
        </>
      ) : (
        <div className={styles.classInfo}>
          <div className={styles.infoRow}>
            <label>Class:</label>
            <span>{classData?.name}</span>
          </div>
          <div className={styles.infoRow}>
            <label>Tutor:</label>
            <span>{classData?.tutor.fullName}</span>
          </div>
          <div className={styles.infoRow}>
            <label>Course:</label>
            <span>{classData?.courses[0]?.name}</span>
          </div>
          <div className={styles.infoRow}>
            <label>Students:</label>
            <span>{classData?.students.map((s: any) => s.fullName).join(', ')}</span>
          </div>
        </div>
      )}

      <div className={styles.formGroup}>
        <label htmlFor="notes">Notes (Optional)</label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          className={styles.textarea}
        />
      </div>

      <div className={styles.formActions}>
        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? 'Creating...' : 'Create Meeting'}
        </button>
      </div>
    </form>
  );
}

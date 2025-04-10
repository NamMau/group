'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { courseService, Course } from '../../../../../services/courseService';
import { authService } from '../../../../../services/authService'; // Import authService
// import { userService } from '../../../../../services/userService'; // Không cần import userService cho logic này
import styles from './courseDetail.module.css';
import { toast } from 'react-hot-toast';
//import { ParamValue } from 'next/dist/shared/lib/router/utils/route-matcher'; // Import ParamValue

const CourseDetailPage = () => {
  const { courseId: courseIdParam } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isUserEnrolled, setIsUserEnrolled] = useState(false);

  const courseId = Array.isArray(courseIdParam) ? courseIdParam[0] : courseIdParam;

  useEffect(() => {
    const fetchCourseDetailsAndCheckEnrollment = async (id: string) => {
      try {
        setLoading(true);
        const courseData = await courseService.getCourse(id);
        setCourse(courseData);

        const user = authService.getUser();
        if (user?.id) {
          setIsUserEnrolled(courseData?.students?.includes(user.id) || false);
        }
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to load course details');
        setLoading(false);
      }
    };

    if (typeof courseId === 'string') {
      fetchCourseDetailsAndCheckEnrollment(courseId);
    }
  }, [courseId]);

  const handleEnrollCourse = async () => {
    setIsEnrolling(true);
    const user = authService.getUser();
    if (!user?.id) {
      toast.error('You need to log in to enroll in a course.');
      setIsEnrolling(false);
      router.push('/student/login');
      return;
    }

    if (typeof courseId === 'string') {
      try {
        const response = await courseService.enrollInCourse(courseId, user.id);
        if (response) {
          toast.success('Enrolled in the course successfully!');
          setIsUserEnrolled(true);
          // update course details after enrollment
          const updatedCourse = await courseService.getCourse(courseId);
          setCourse(updatedCourse);
        } else {
          toast.error('Failed to enroll in the course.');
        }
      } catch (error: any) {
        toast.error(error.message || 'Something went wrong.');
      } finally {
        setIsEnrolling(false);
      }
    } else {
      console.error('Course ID is undefined.');
      toast.error('Id not find.');
    }
  };

  if (loading) {
    return <div className={styles.container}>Loading course details...</div>;
  }

  if (error) {
    return <div className={styles.container}>Error: {error}</div>;
  }

  if (!course) {
    return <div className={styles.container}>Course not found.</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Course Name: {course.name}</h1>
      <p className={styles.description}>Description: {course.description}</p>

      {/* ... (Course Detail) ... */}

      {!isUserEnrolled ? (
        <button
          className={styles.enrollButton}
          onClick={handleEnrollCourse}
          disabled={isEnrolling}
        >
          {isEnrolling ? 'Enrolling...' : 'Enroll Course'}
        </button>
      ) : (
        <p className={styles.enrolledMessage}>You are already enrolled in this course.</p>
      )}

      {course.students && course.students.length > 0 && (
        <div className={styles.studentsList}>
          <h3 className={styles.studentsTitle}>Students:</h3>
          <ul>
            {/* {course.students.map(studentId => (
              <li key={studentId} className={styles.studentItem}>Student ID: {studentId}</li>
            ))} */}
          </ul>
        </div>
      )}

      {/* ... () ... */}
    </div>
  );
};

export default CourseDetailPage;
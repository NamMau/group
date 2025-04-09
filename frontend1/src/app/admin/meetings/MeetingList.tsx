'use client';

import React, { useEffect, useState } from 'react';
import { meetingService } from '../../../services/meetingService';
import { userService } from '../../../services/userService';
import type { User } from '../../../services/userService';
import { courseService } from '../../../services/courseService';
import type { Course } from '../../../services/courseService';
import { toast } from 'react-hot-toast';
import styles from './meetings.module.css';
import type { Meeting } from '../../../services/meetingService';

export default function MeetingList() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [courses, setCourses] = useState<Record<string, Course>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      // 1. Fetch meetings
      const data = await meetingService.getAllMeetings();
      console.log('Meetings data:', data);
      setMeetings(data);

      // 2. Fetch users data
      const userIds = new Set([
        ...data.map(m => m.tutor),
        ...data.flatMap(m => m.students)
      ]);
      console.log('User IDs to fetch:', [...userIds]);

      const [studentsData, tutorsData] = await Promise.all([
        userService.getStudents(),
        userService.getTutors()
      ]);
      console.log('Students data:', studentsData);
      console.log('Tutors data:', tutorsData);

      const usersMap = Object.fromEntries(
        [...studentsData, ...tutorsData].map(user => [user._id, user])
      );
      console.log('Users map:', usersMap);
      setUsers(usersMap);

      // 3. Fetch courses data
      const courseIds = new Set(data.map(m => m.course?._id).filter(Boolean)); // Access _id of course object
      console.log('Course IDs to fetch:', [...courseIds]);

      try {
        const coursesData = await courseService.getAllCourses();
        console.log('All courses:', coursesData);

        const filteredCourses = coursesData.filter(course => courseIds.has(course._id));
        console.log('Filtered courses:', filteredCourses);

        const coursesMap = Object.fromEntries(
          filteredCourses.map(course => [course._id, course])
        );
        console.log('Courses map:', coursesMap);
        setCourses(coursesMap);
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast.error('Failed to load course information');
      }
    } catch (error) {
      console.error('Error fetching meetings:', error);
      toast.error('Failed to load meetings');
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (date: Date, time: Date) => { // Expecting Date objects
    try {
      if (!(date instanceof Date) || isNaN(date.getTime()) || !(time instanceof Date) || isNaN(time.getTime())) {
        return 'Invalid Date';
      }

      const combinedDateTime = new Date(date);
      combinedDateTime.setHours(time.getUTCHours(), time.getUTCMinutes(), time.getUTCSeconds(), time.getUTCMilliseconds());

      return combinedDateTime.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  const calculateEndTime = (date: Date, time: Date, duration: number) => { // Expecting Date objects
    try {
      if (!(date instanceof Date) || isNaN(date.getTime()) || !(time instanceof Date) || isNaN(time.getTime())) {
        return 'Invalid Date';
      }

      const startDate = new Date(date);
      startDate.setHours(time.getUTCHours(), time.getUTCMinutes(), time.getUTCSeconds(), time.getUTCMilliseconds());
      const endDate = new Date(startDate.getTime() + duration * 60000); // duration in minutes to milliseconds

      return endDate.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error('Error calculating end time:', error);
      return 'Invalid Date';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return styles.statusScheduled;
      case 'ongoing':
        return styles.statusOngoing;
      case 'completed':
        return styles.statusCompleted;
      case 'cancelled':
        return styles.statusCanceled;
      default:
        return '';
    }
  };

  const getTutorName = (tutorId: string) => {
    const tutor = users[tutorId];
    if (!tutor) {
      console.log(`No tutor found for ID: ${tutorId}`);
      return 'Unknown Tutor';
    }
    return tutor.fullName;
  };

  const getStudentNames = (studentIds: string[]) => {
    return studentIds
      .map(id => {
        const student = users[id];
        if (!student) {
          console.log(`No student found for ID: ${id}`);
          return 'Unknown Student';
        }
        return student.fullName;
      })
      .join(', ');
  };

  const getCourseName = (courseId: string) => {
    const course = courses[courseId];
    if (!course) {
      console.log(`No course found for ID: ${courseId}`);
      return 'Unknown Course';
    }
    return course.name;
  };

  if (loading) {
    return <div className={styles.loading}>Loading meetings...</div>;
  }

  if (meetings.length === 0) {
    return <div className={styles.empty}>No meetings found</div>;
  }

  return (
    <div className={styles.meetingList}>
      {meetings.map(meeting => (
        <div key={meeting._id} className={styles.meetingCard}>
          <div className={styles.meetingHeader}>
            <h3 className={styles.meetingTitle}>{meeting.notes || 'Untitled Meeting'}</h3>
            <span className={`${styles.status} ${getStatusColor(meeting.status)}`}>
              {meeting.status}
            </span>
          </div>

          <div className={styles.meetingDetails}>
            <div className={styles.detailGroup}>
              <span className={styles.label}>Start:</span>
              <span>{formatDateTime(meeting.date, meeting.time)}</span>
            </div>
            <div className={styles.detailGroup}>
              <span className={styles.label}>End:</span>
              <span>{calculateEndTime(meeting.date, meeting.time, meeting.duration)}</span>
            </div>
            <div className={styles.detailGroup}>
              <span className={styles.label}>Duration:</span>
              <span>{meeting.duration} minutes</span>
            </div>
          </div>

          <div className={styles.participants}>
            <div className={styles.detailGroup}>
              <span className={styles.label}>Tutor:</span>
              <span>{getTutorName(meeting.tutor?._id)}</span> {/* Access _id of tutor object */}
            </div>
            <div className={styles.detailGroup}>
              <span className={styles.label}>Students:</span>
              <span>{getStudentNames(meeting.students)}</span>
            </div>
            {meeting.course?._id && ( // Check if course object and _id exist
              <div className={styles.detailGroup}>
                <span className={styles.label}>Course:</span>
                <span>{getCourseName(meeting.course._id)}</span>
              </div>
            )}
            {meeting.meetingLink && (
              <div className={styles.detailGroup}>
                <span className={styles.label}>Meeting Link:</span>
                <a href={meeting.meetingLink} target="_blank" rel="noopener noreferrer" className={styles.link}>
                  View Meeting
                </a>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
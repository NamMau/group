'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { meetingService } from '../../../services/meetingService';
import { userService } from '../../../services/userService';
import type { User } from '../../../services/userService';
import { courseService } from '../../../services/courseService';
import type { Course } from '../../../services/courseService';
import { toast } from 'react-hot-toast';
import styles from './meetings.module.css';
import type { Meeting } from '../../../services/meetingService';

export default function MeetingList() {
  const router = useRouter();
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
      
      // 1. Fetch all required data in parallel
      const [meetingsData, studentsData, tutorsData, coursesData] = await Promise.all([
        meetingService.getAllMeetings(),
        userService.getStudents(),
        userService.getTutors(),
        courseService.getAllCourses()
      ]);

      console.log('Meetings data:', meetingsData);
      console.log('Students data:', studentsData);
      console.log('Tutors data:', tutorsData);
      console.log('Courses data:', coursesData);

      // 2. Create users map
      const usersMap = Object.fromEntries(
        [...studentsData, ...tutorsData].map(user => [user._id, user])
      );
      console.log('Users map:', usersMap);

      // 3. Create courses map
      const coursesMap = Object.fromEntries(
        coursesData.map(course => [course._id, course])
      );
      console.log('Courses map:', coursesMap);

      // 4. Set state
      setMeetings(meetingsData);
      setUsers(usersMap);
      setCourses(coursesMap);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load meetings data');
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (date: Date, time: string) => {
    try {
      if (!(date instanceof Date) || isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      const [hours, minutes] = time.split(':');
      const combinedDateTime = new Date(date);
      combinedDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      return combinedDateTime.toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  const calculateEndTime = (date: Date, time: string, duration: number) => {
    try {
      if (!(date instanceof Date) || isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      const [hours, minutes] = time.split(':');
      const startDate = new Date(date);
      startDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      const endDate = new Date(startDate.getTime() + duration * 60000);
      return endDate.toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
    } catch (error) {
      console.error('Error calculating end time:', error);
      return 'Invalid Date';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled': return styles.statusScheduled;
      case 'ongoing': return styles.statusOngoing;
      case 'completed': return styles.statusCompleted;
      case 'cancelled': return styles.statusCanceled;
      default: return '';
    }
  };

  const getTutorName = (tutorId: string) => {
    if (!tutorId) return 'Unknown Tutor';
    const tutor = users[tutorId];
    if (!tutor) {
      console.log(`No tutor found for ID: ${tutorId}`);
      return 'Unknown Tutor';
    }
    return tutor.fullName;
  };

  const getStudentNames = (studentIds: string[]) => {
    if (!studentIds || studentIds.length === 0) return 'No Students';
    return studentIds
      .map(id => {
        const student = users[id];
        if (!student) {
          console.log(`No student found for ID: ${id}`);
          return 'Unknown Student';
        }
        return student.fullName;
      })
      .filter(name => name !== 'Unknown Student')
      .join(', ') || 'Unknown Students';
  };

  const getCourseName = (courseId: string) => {
    if (!courseId) return 'Unknown Course';
    const course = courses[courseId];
    if (!course) {
      console.log(`No course found for ID: ${courseId}`);
      return 'Unknown Course';
    }
    return course.name;
  };

  const handleUpdateMeeting = (meetingId: string) => {
    if (!meetingId) return;
    router.push(`/admin/meetings/edit/${meetingId}`);
  };

  const handleDeleteMeeting = async (meetingId: string) => {
    if (!meetingId) return;
    if (window.confirm('Are you sure you want to delete this meeting?')) {
      try {
        await meetingService.deleteMeeting(meetingId);
        toast.success('Meeting deleted successfully');
        // Refresh the meetings list
        fetchMeetings();
      } catch (error) {
        console.error('Error deleting meeting:', error);
        toast.error('Failed to delete meeting');
      }
    }
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
            <div className={styles.headerActions}>
              <span className={`${styles.status} ${getStatusColor(meeting.status)}`}>
                {meeting.status}
              </span>
              <div className={styles.actionButtons}>
                {meeting._id && (
                  <>
                    <button
                      onClick={() => handleUpdateMeeting(meeting._id as string)}
                      className={styles.editButton}
                      title="Edit Meeting"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteMeeting(meeting._id as string)}
                      className={styles.deleteButton}
                      title="Delete Meeting"
                    >
                      🗑️
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className={styles.meetingDetails}>
            <div className={styles.detailGroup}>
              <span className={styles.label}>Start:</span>
              <span>{formatDateTime(new Date(meeting.date), meeting.time)}</span>
            </div>
            <div className={styles.detailGroup}>
              <span className={styles.label}>End:</span>
              <span>{calculateEndTime(new Date(meeting.date), meeting.time, meeting.duration)}</span>
            </div>
            <div className={styles.detailGroup}>
              <span className={styles.label}>Duration:</span>
              <span>{meeting.duration} minutes</span>
            </div>
          </div>

          <div className={styles.participants}>
            <div className={styles.detailGroup}>
              <span className={styles.label}>Tutor:</span>
              <span>{getTutorName(meeting.tutorId)}</span>
            </div>
            <div className={styles.detailGroup}>
              <span className={styles.label}>Students:</span>
              <span>{getStudentNames(meeting.students)}</span>
            </div>
            {meeting.courseId && (
              <div className={styles.detailGroup}>
                <span className={styles.label}>Course:</span>
                <span>{getCourseName(meeting.courseId)}</span>
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
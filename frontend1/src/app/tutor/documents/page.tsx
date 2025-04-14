"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Document, documentService } from '@/services/documentService';
import { courseService } from '@/services/courseService';
import { Course } from '@/services/courseService';
import { authService } from '@/services/authService';
import styles from './documents.module.css';

export default function TutorDocuments() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const user = authService.getUser();
        if (!user) {
          setError('User not authenticated');
          return;
        }
        const tutorCourses = await courseService.getUserCourses(user._id);
        setCourses(tutorCourses);
        if (tutorCourses.length > 0) {
          setSelectedCourse(tutorCourses[0]._id);
        }
      } catch (err) {
        setError('Failed to load courses');
        console.error(err);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!selectedCourse) return;
      
      setLoading(true);
      try {
        const docs = await documentService.getDocumentsByCourse(selectedCourse);
        setDocuments(docs);
        setError(null);
      } catch (err) {
        setError('Failed to load documents');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [selectedCourse]);

  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCourse(e.target.value);
  };

  if (loading && !documents.length) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Course Documents</h1>
      
      <div className={styles.courseSelector}>
        <label htmlFor="course">Select Course:</label>
        <select 
          id="course" 
          value={selectedCourse} 
          onChange={handleCourseChange}
          className={styles.select}
        >
          {courses.map(course => (
            <option key={course._id} value={course._id}>
              {course.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.documentsList}>
        {documents.length === 0 ? (
          <p className={styles.noDocuments}>No documents found for this course</p>
        ) : (
          documents.map(doc => (
            <div key={doc._id} className={styles.documentCard}>
              <div className={styles.documentHeader}>
                <h3 className={styles.documentTitle}>{doc.name}</h3>
                <span className={styles.documentDate}>
                  {new Date(doc.submissionDate).toLocaleDateString()}
                </span>
              </div>
              
              <div className={styles.documentInfo}>
                <div className={styles.fileInfo}>
                  <span>Type: {doc.fileType}</span>
                  <span>Size: {Math.round(doc.fileSize / 1024)} KB</span>
                  <span>Status: {doc.status}</span>
                  {doc.grade && <span>Grade: {doc.grade}</span>}
                </div>
                <a 
                  href={doc.fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.downloadButton}
                >
                  Download
                </a>
              </div>

              {doc.feedback && (
                <div className={styles.feedbackSection}>
                  <h4>Feedback</h4>
                  <p>{doc.feedback}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
} 
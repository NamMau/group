'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './course.module.css';
import { authService } from '../../../services/authService';
import { courseService, Course } from '../../../services/courseService'; // Import courseService and Course interface

interface CourseTableProps {
  searchTerm?: string;
}

export default function CourseTable({ searchTerm = '' }: CourseTableProps) {
  const router = useRouter();
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const coursesPerPage = 2;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!authService.isAuthenticated()) {
          console.log('Not authenticated, redirecting to login');
          router.push('/admin/login');
          return;
        }

        const coursesData = await courseService.getAllCourses();
        console.log('Fetched Courses Data:', coursesData);
        setCourses(coursesData);
      } catch (error) {
        console.error('Error fetching courses:', error);
        if (error instanceof Error && error.message === 'Unauthorized') {
          console.log('Unauthorized, removing token and redirecting');
          authService.removeToken();
          router.push('/admin/login');
        } else {
          setError(error instanceof Error ? error.message : 'Failed to fetch courses');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [router]);

  const filteredCourses = courses.filter(
    (course) =>
      course.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const startIndex = (currentPage - 1) * coursesPerPage;
  const currentCourses = filteredCourses.slice(startIndex, startIndex + coursesPerPage);

  const handleSelectCourse = (id: string) => {
    if (selectedCourses.includes(id)) {
      setSelectedCourses(selectedCourses.filter((courseId) => courseId !== id));
    } else {
      setSelectedCourses([...selectedCourses, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedCourses.length === currentCourses.length) {
      setSelectedCourses([]);
    } else {
      setSelectedCourses(currentCourses.map((course) => course._id));
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedCourses([]);
  };

  const handleEditCourse = async (courseId: string) => {
    const newName = prompt('Enter new course name:');
    const newDescription = prompt('Enter new description:');

    if (!newName || !newDescription) {
      alert('Course name and description cannot be empty.');
      return;
    }

    try {
      if (!authService.isAuthenticated()) {
        router.push('/admin/login');
        return;
      }

      const updatedCourse = await courseService.updateCourse(courseId, {
        name: newName,
        description: newDescription,
      });

      setCourses(
        courses.map((course) =>
          course._id === courseId ? { ...course, ...updatedCourse } : course
        )
      );
      alert('Course updated successfully!');
    } catch (error) {
      console.error('Error updating course:', error);
      alert(error instanceof Error ? error.message : 'Failed to update course');
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;

    try {
      if (!authService.isAuthenticated()) {
        router.push('/admin/login');
        return;
      }

      await courseService.deleteCourse(courseId);
      setCourses(courses.filter((course) => course._id !== courseId));
      alert('Course deleted successfully!');
    } catch (error) {
      console.error('Error deleting course:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete course');
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm('Are you sure you want to delete all selected courses?')) return;

    try {
      if (!authService.isAuthenticated()) {
        router.push('/admin/login');
        return;
      }

      await Promise.all(selectedCourses.map((id) => courseService.deleteCourse(id)));
      setCourses(courses.filter((course) => !selectedCourses.includes(course._id)));
      setSelectedCourses([]);
      alert('Courses deleted successfully!');
    } catch (error) {
      console.error('Error deleting courses:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete courses');
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (filteredCourses.length === 0) {
    return (
      <div className={styles.content}>
        <div className={styles.noCourses}>
          <div className={styles.koalaImage}>🐨 Z Z</div>
          <h2 className={styles.title}>No courses found</h2>
          <p className={styles.description}>
            {searchTerm ? 'Try searching with a different name.' : 'Courses will appear here after they are created.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {selectedCourses.length > 0 && (
        <div className={styles.deleteAllContainer}>
          <button className={styles.deleteAllButton} onClick={handleDeleteAll}>
            Delete All
          </button>
        </div>
      )}

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedCourses.length === currentCourses.length && currentCourses.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th>Name</th>
              <th>Description</th>
              <th>Operation</th>
            </tr>
          </thead>
          <tbody>
            {currentCourses.map((course) => (
              <tr key={course._id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedCourses.includes(course._id)}
                    onChange={() => handleSelectCourse(course._id)}
                  />
                </td>
                <td>{course.name}</td>
                <td>{course.description}</td>
                <td>
                  <button
                    className={styles.editButton}
                    onClick={() => handleEditCourse(course._id)}
                  >
                    ✏️
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteCourse(course._id)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.pagination}>
          <span>
            Showing {startIndex + 1}-{Math.min(startIndex + coursesPerPage, filteredCourses.length)} of {filteredCourses.length}
          </span>
          <div className={styles.pageButtons}>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                className={currentPage === index + 1 ? styles.activePage : styles.pageButton}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
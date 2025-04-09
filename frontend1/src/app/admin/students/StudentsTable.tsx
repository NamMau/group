'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './students.module.css';
import { userService } from '../../../services/userService';
import { authService } from '../../../services/authService';

interface Student {
  _id: string;
  fullName: string;
  email: string;
  department?: string;
  avatar?: string;
}

interface StudentsTableProps {
  searchTerm?: string;
}

export default function StudentsTable({ searchTerm = '' }: StudentsTableProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const studentsPerPage = 5;

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!authService.isAuthenticated()) {
          setError('Please login to view students');
          router.push('/admin/login');
          return;
        }

        const token = authService.getToken();
        if (!token) {
          router.push('/admin/login');
          return;
        }

        const data = await userService.getStudents();
        setStudents(data);
      } catch (error) {
        console.error('Error fetching students:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch students');
        if (error instanceof Error && error.message === 'Unauthorized access') {
          authService.removeToken();
          router.push('/admin/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [router]);

  const handleDelete = async (studentId: string) => {
    if (!confirm('Are you sure you want to delete this student?')) return;
    
    try {
      const token = authService.getToken();
      if (!token) {
        router.push('/admin/login');
        return;
      }

      await userService.deleteUser(studentId);
      setStudents(students.filter((student) => student._id !== studentId));
      alert('Student deleted successfully');
    } catch (error) {
      console.error('Error deleting student:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete student');
      if (error instanceof Error && error.message === 'Unauthorized access') {
        authService.removeToken();
        router.push('/admin/login');
      }
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  const filteredStudents = students.filter((student) =>
    student.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const startIndex = (currentPage - 1) * studentsPerPage;
  const currentStudents = filteredStudents.slice(startIndex, startIndex + studentsPerPage);

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentStudents.map((student) => (
            <tr key={student._id}>
              <td>
                <div className={styles.nameCell}>
                  <div className={styles.avatarContainer}>
                    <Image
                      src={student.avatar || '/default-avatar.png'}
                      alt={`${student.fullName}'s avatar`}
                      width={40}
                      height={40}
                      className={styles.avatar}
                      unoptimized
                    />
                  </div>
                  {student.fullName}
                </div>
              </td>
              <td>{student.email}</td>
              <td className={student.department ? styles.department : styles.notAssigned}>
                {student.department || 'Not assigned'}
              </td>
              <td>
                <div className={styles.operation}>
                  <Link href={`/admin/students/edit?studentId=${student._id}`}>
                    <button className={styles.editButton}>✏️ Edit</button>
                  </Link>
                  <button 
                    className={styles.deleteButton} 
                    onClick={() => handleDelete(student._id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.pagination}>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={currentPage === index + 1 ? styles.activePage : styles.pageButton}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
} 
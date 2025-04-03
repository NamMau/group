'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './teachers.module.css';
import { authService, API_URL } from '../../../services/authService';

export default function TeachersTable({ searchTerm }) {
  const [tutors, setTutors] = useState([]);
  const [selectedTutors, setSelectedTutors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const tutorsPerPage = 5;

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Debug logs
        const token = authService.getToken();
        console.log('Current token:', token);
        console.log('Is authenticated:', authService.isAuthenticated());
        
        if (!authService.isAuthenticated()) {
          console.log('Not authenticated, redirecting to login');
          setError('Please login to view tutors');
          router.push('/admin/login');
          return;
        }

        const headers = authService.getAuthHeaders();
        console.log('Request headers:', headers);

        const response = await fetch(`${API_URL}/users/get-tutors`, {
          method: 'GET',
          headers,
          cache: 'no-store'
        });

        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);

        if (!response.ok) {
          if (response.status === 401) {
            console.log('Unauthorized, removing token and redirecting');
            authService.removeToken();
            router.push('/admin/login');
            return;
          }
          throw new Error(data.message || 'Failed to fetch tutors');
        }

        // Backend returns array directly
        setTutors(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching tutors:', error);
        setError(error.message || 'Failed to fetch tutors');
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, [router]);

  const handleDelete = async (tutorId) => {
    if (!confirm('Are you sure you want to delete this tutor?')) return;
    
    try {
      if (!authService.isAuthenticated()) {
        router.push('/admin/login');
        return;
      }

      const response = await fetch(`${API_URL}/users/delete-user/${tutorId}`, {
        method: 'DELETE',
        headers: authService.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          authService.removeToken();
          router.push('/admin/login');
          return;
        }
        throw new Error(data.message || 'Failed to delete tutor');
      }

      setTutors(tutors.filter((tutor) => tutor._id !== tutorId));
      alert('Tutor deleted successfully');
    } catch (error) {
      console.error('Error deleting tutor:', error);
      alert(error.message || 'Failed to delete tutor');
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  const filteredTutors = Array.isArray(tutors) 
    ? tutors.filter((tutor) =>
        tutor.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tutor.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const totalPages = Math.ceil(filteredTutors.length / tutorsPerPage);
  const startIndex = (currentPage - 1) * tutorsPerPage;
  const currentTutors = filteredTutors.slice(startIndex, startIndex + tutorsPerPage);

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
          {currentTutors.map((tutor) => (
            <tr key={tutor._id}>
              <td>
                <div className={styles.nameCell}>
                  <img 
                    src={tutor.avatar || 'https://via.placeholder.com/40'} 
                    alt="Avatar" 
                    className={styles.avatar} 
                  />
                  {tutor.fullName}
                </div>
              </td>
              <td>{tutor.email}</td>
              <td>{tutor.department || 'Not assigned'}</td>
              <td>
                <div className={styles.operation}>
                  <Link href={`/admin/teachers/edit?tutorId=${tutor._id}`}>
                    <button className={styles.editButton}>✏️ Edit</button>
                  </Link>
                  <button 
                    className={styles.deleteButton} 
                    onClick={() => handleDelete(tutor._id)}
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

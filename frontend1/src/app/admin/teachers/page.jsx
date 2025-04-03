'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './teachers.module.css';
import TeachersTable from './TeachersTable';
import { authService, API_URL } from '../../../services/authService';
import './metadata';

export default function Teachers() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      console.log('Not authenticated, redirecting to admin login');
      router.push('/admin/login');
      return;
    }

    console.log('Authenticated, fetching tutors');
    fetchTutors();
  }, [router]);

  const fetchTutors = async () => {
    try {
      setError(null);
      console.log('Making API request to:', `${API_URL}/users/get-tutors`);
      console.log('With headers:', authService.getAuthHeaders());
      
      const response = await fetch(`${API_URL}/users/get-tutors`, {
        headers: authService.getAuthHeaders(),
        cache: 'no-store' // Disable caching
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          console.log('Token invalid, removing and redirecting');
          authService.removeToken();
          router.push('/admin/login');
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch tutors');
      }

      const data = await response.json();
      console.log('Fetched tutors:', data);
      setTutors(data);
    } catch (error) {
      console.error('Error fetching tutors:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.teachers}>
      <div className={styles.header}>
        <div className={styles.searchBar}>
          <div className={styles.filter}>
            <select className={styles.filterSelect}>
              <option>Add filter</option>
            </select>
          </div>
          <input
            type="text"
            placeholder="Search for a teacher by name or email"
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : (
        <TeachersTable tutors={tutors} searchTerm={searchTerm} />
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './dashboard.module.css';
import { authService, API_URL } from '../../../services/authService';

interface DashboardStats {
  totalUsers: number;
  totalCourses: number;
  totalClasses: number;
  totalEnrollments: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalCourses: 0,
    totalClasses: 0,
    totalEnrollments: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!authService.isAuthenticated()) {
          console.log('Not authenticated, redirecting to login');
          router.push('/admin/login');
          return;
        }

        const response = await fetch(`${API_URL}/admin/dashboard-for-admin`, {
          method: 'GET',
          headers: authService.getAuthHeaders(),
          cache: 'no-store'
        });

        if (!response.ok) {
          if (response.status === 401) {
            console.log('Unauthorized, removing token and redirecting');
            authService.removeToken();
            router.push('/admin/login');
            return;
          }
          throw new Error('Failed to fetch dashboard stats');
        }

        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch dashboard stats');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [router]);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Admin Dashboard</h1>
      
      <div className={styles.cards}>
        <div className={styles.card}>
          <div className={styles.cardNumber}>{stats.totalUsers}</div>
          <div className={styles.cardLabel}>Total Users</div>
          <button 
            className={styles.cardButton}
            onClick={() => router.push('/admin/users')}
          >
            View Users
          </button>
        </div>

        <div className={styles.card}>
          <div className={styles.cardNumber}>{stats.totalCourses}</div>
          <div className={styles.cardLabel}>Total Courses</div>
          <button 
            className={styles.cardButton}
            onClick={() => router.push('/admin/course')}
          >
            View Courses
          </button>
        </div>

        <div className={styles.card}>
          <div className={styles.cardNumber}>{stats.totalClasses}</div>
          <div className={styles.cardLabel}>Total Classes</div>
          <button 
            className={styles.cardButton}
            onClick={() => router.push('/admin/classes')}
          >
            View Classes
          </button>
        </div>

        <div className={styles.card}>
          <div className={styles.cardNumber}>{stats.totalEnrollments}</div>
          <div className={styles.cardLabel}>Total Enrollments</div>
          <button 
            className={styles.cardButton}
            onClick={() => router.push('/admin/enrollments')}
          >
            View Enrollments
          </button>
        </div>
      </div>

      <div className={styles.addBlocks}>
        <div 
          className={styles.addBlock}
          onClick={() => router.push('/admin/course/add')}
        >
          <div className={styles.addIcon}>📚</div>
          <div>
            <div className={styles.addTitle}>Add New Course</div>
            <div className={styles.addDescription}>Create a new course for students</div>
          </div>
        </div>

        <div 
          className={styles.addBlock}
          onClick={() => router.push('/admin/classes/add')}
        >
          <div className={styles.addIcon}>🏫</div>
          <div>
            <div className={styles.addTitle}>Add New Class</div>
            <div className={styles.addDescription}>Create a new class for a course</div>
          </div>
        </div>

        <div 
          className={styles.addBlock}
          onClick={() => router.push('/admin/students/add')}
        >
          <div className={styles.addIcon}>👥</div>
          <div>
            <div className={styles.addTitle}>Add New Student</div>
            <div className={styles.addDescription}>Create a new student account</div>
          </div>
        </div>
      </div>
    </div>
  );
} 
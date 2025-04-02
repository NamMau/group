'use client';

import { useState, useEffect } from 'react';
import styles from './dashboard.module.css';

export const metadata = {
  title: 'Admin Dashboard',
};

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalTutors: 0,
    totalCourses: 0,
    totalClasses: 0,
    recentUsers: [],
    recentCourses: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/v1/dashboard-for-admin', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch stats');
        }

        setStats(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Welcome to your dashboard, eTutoring</h1>

      {/* Cards thống kê */}
      <div className={styles.cards}>
        <div className={styles.card}>
          <h2 className={styles.cardNumber}>{stats.totalUsers}</h2>
          <p className={styles.cardLabel}>Total Users</p>
        </div>
        <div className={styles.card}>
          <h2 className={styles.cardNumber}>{stats.totalStudents}</h2>
          <p className={styles.cardLabel}>Total Students</p>
        </div>
        <div className={styles.card}>
          <h2 className={styles.cardNumber}>{stats.totalTutors}</h2>
          <p className={styles.cardLabel}>Total Tutors</p>
        </div>
        <div className={styles.card}>
          <h2 className={styles.cardNumber}>{stats.totalCourses}</h2>
          <p className={styles.cardLabel}>Total Courses</p>
        </div>
        <div className={styles.card}>
          <h2 className={styles.cardNumber}>{stats.totalClasses}</h2>
          <p className={styles.cardLabel}>Total Classes</p>
        </div>
      </div>

      {/* Bảng Recent Users */}
      <div className={styles.recentSection}>
        <h2 className={styles.sectionTitle}>Recent Users</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {stats.recentUsers.length > 0 ? (
              stats.recentUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className={styles.noData}>No recent users</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Bảng Recent Courses */}
      <div className={styles.recentSection}>
        <h2 className={styles.sectionTitle}>Recent Courses</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Course Name</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {stats.recentCourses.length > 0 ? (
              stats.recentCourses.map((course) => (
                <tr key={course.id}>
                  <td>{course.name}</td>
                  <td>{new Date(course.CreatedAt).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className={styles.noData}>No recent courses</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

          {/* Khối "Add" */}
          <div className={styles.addBlocks}>
          <div className={styles.addBlock}>
            <span className={styles.addIcon}>👤</span>
            <div>
              <h3 className={styles.addTitle}>Add other admins</h3>
              <p className={styles.addDescription}>
                Create rich course content and coaching products for your students. When you give them a pricing plan, they'll appear on your site!
              </p>
            </div>
          </div>
          <div className={styles.addBlock}>
            <span className={styles.addIcon}>🏫</span>
            <div>
              <h3 className={styles.addTitle}>Add classes</h3>
              <p className={styles.addDescription}>
                Create rich course content and coaching products for your students. When you give them a pricing plan, they'll appear on your site!
              </p>
            </div>
          </div>
          <div className={styles.addBlock}>
            <span className={styles.addIcon}>🎓</span>
            <div>
              <h3 className={styles.addTitle}>Add students</h3>
              <p className={styles.addDescription}>
                Create rich course content and coaching products for your students. When you give them a pricing plan, they'll appear on your site!
              </p>
            </div>
          </div>
        </div>

      </div>
  );
}



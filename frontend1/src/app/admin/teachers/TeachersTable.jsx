'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './teachers.module.css';

export default function TeachersTable({ searchTerm }) {
  const [tutors, setTutors] = useState([]);
  const [selectedTutors, setSelectedTutors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const tutorsPerPage = 5;

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/v1/users/get-tutors', {
          credentials: 'include',
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Thêm token từ localStorage
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) throw new Error('Failed to fetch tutors');
        const data = await response.json();
        setTutors(data);
      } catch (error) {
        console.error('Error fetching tutors:', error);
      }
    };
    fetchTutors();
  }, []);

  const handleDelete = async (tutorId) => {
    if (!confirm('Are you sure you want to delete this tutor?')) return;
    try {
      const response = await fetch(`http://localhost:5000/api/v1/users/delete-user/${tutorId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Thêm token từ localStorage
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to delete tutor');
      setTutors(tutors.filter((tutor) => tutor.tutorId !== tutorId));
    } catch (error) {
      console.error('Error deleting tutor:', error);
      alert('Failed to delete tutor');
    }
  };
  

  const filteredTutors = tutors.filter((tutor) =>
    tutor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredTutors.length / tutorsPerPage);
  const startIndex = (currentPage - 1) * tutorsPerPage;
  const currentTutors = filteredTutors.slice(startIndex, startIndex + tutorsPerPage);

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Teacher ID</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentTutors.map((tutor) => (
            <tr key={tutor.tutorId}>
              <td>
                <img src={tutor.avatar || 'https://via.placeholder.com/40'} alt="Avatar" className={styles.avatar} />
                {tutor.name}
              </td>
              <td>{tutor.tutorId}</td>
              <td>{tutor.email}</td>
              <td>
                <Link href={`/admin/teachers/edit?tutorId=${tutor.tutorId}`}>
                  <button className={styles.editButton}>✏️ Edit</button>
                </Link>
                <button className={styles.deleteButton} onClick={() => handleDelete(tutor.tutorId)}>🗑️ Delete</button>
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

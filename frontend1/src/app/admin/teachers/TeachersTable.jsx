'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './teachers.module.css';

export default function TeachersTable({ searchTerm }) {
  const [teachers, setTeachers] = useState([
    { id: 1, name: 'Kristen Watson', teacherId: '9784', class: 'Go to class', email: 'michelle.rivera@example.com' },
    { id: 2, name: 'John Doe', teacherId: '9785', class: 'Go to class', email: 'john.doe@example.com' },
    { id: 3, name: 'Jane Smith', teacherId: '9786', class: 'Go to class', email: 'jane.smith@example.com' },
  ]);

  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const teachersPerPage = 2;
  const filteredTeachers = teachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredTeachers.length / teachersPerPage);
  const startIndex = (currentPage - 1) * teachersPerPage;
  const currentTeachers = filteredTeachers.slice(startIndex, startIndex + teachersPerPage);

  const handleSelectTeacher = (id) => {
    if (selectedTeachers.includes(id)) {
      setSelectedTeachers(selectedTeachers.filter((teacherId) => teacherId !== id));
    } else {
      setSelectedTeachers([...selectedTeachers, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedTeachers.length === currentTeachers.length) {
      setSelectedTeachers([]);
    } else {
      setSelectedTeachers(currentTeachers.map((teacher) => teacher.id));
    }
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this teacher?')) {
      setTeachers(teachers.filter((teacher) => teacher.id !== id));
      setSelectedTeachers(selectedTeachers.filter((teacherId) => teacherId !== id));
    }
  };

  const handleDeleteAll = () => {
    if (confirm('Are you sure you want to delete all selected teachers?')) {
      setTeachers(teachers.filter((teacher) => !selectedTeachers.includes(teacher.id)));
      setSelectedTeachers([]);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedTeachers([]);
  };

  if (filteredTeachers.length === 0) {
    return (
      <div className={styles.content}>
        <div className={styles.noTeachers}>
          <div className={styles.koalaImage}>🐨 Z Z</div>
          <h2 className={styles.title}>No teachers at this time</h2>
          <p className={styles.description}>
            Teachers will appear here after they are added to your school.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {selectedTeachers.length > 0 && (
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
                  checked={selectedTeachers.length === currentTeachers.length && currentTeachers.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th>Name</th>
              <th>Teacher ID</th>
              <th>Class</th>
              <th>Email address</th>
              <th>Operation</th>
            </tr>
          </thead>
          <tbody>
            {currentTeachers.map((teacher) => (
              <tr key={teacher.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedTeachers.includes(teacher.id)}
                    onChange={() => handleSelectTeacher(teacher.id)}
                  />
                </td>
                <td className={styles.nameCell}>
                  <img
                    src="https://via.placeholder.com/40"
                    alt="Avatar"
                    className={styles.avatar}
                  />
                  {teacher.name}
                </td>
                <td>{teacher.teacherId}</td>
                <td>
                  <Link href="#" className={styles.classLink}>
                    {teacher.class}
                  </Link>
                </td>
                <td>{teacher.email}</td>
                <td className={styles.operation}>
                  <Link href={`/admin/teachers/edit?teacherId=${teacher.id}`}>
                    <button className={styles.editButton}>
                      <span role="img" aria-label="Edit">✏️</span> {/* Thay bằng biểu tượng bút chì */}
                    </button>
                  </Link>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDelete(teacher.id)}
                  >
                    <span role="img" aria-label="Delete">🗑️</span> {/* Thay bằng biểu tượng thùng rác */}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        <span className={styles.paginationText}>
          SHOWING {startIndex + 1}-{Math.min(startIndex + teachersPerPage, filteredTeachers.length)}
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
  );
}
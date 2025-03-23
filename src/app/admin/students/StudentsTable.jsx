'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './students.module.css';

export default function StudentsTable() {
  const router = useRouter();
  const [students] = useState([
    { id: 1, name: 'Kristen Watson', studentId: '9784', class: 'Go to class', email: 'michelle.rivera@example.com' },
    { id: 2, name: 'John Doe', studentId: '9785', class: 'Go to class', email: 'john.doe@example.com' },
    { id: 3, name: 'Jane Smith', studentId: '9786', class: 'Go to class', email: 'jane.smith@example.com' },
  ]);

  const [selectedStudents, setSelectedStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(''); // Trạng thái cho ô tìm kiếm
  const studentsPerPage = 2;

  // Lọc sinh viên dựa trên ô tìm kiếm (tìm theo cả tên và email)
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const startIndex = (currentPage - 1) * studentsPerPage;
  const currentStudents = filteredStudents.slice(startIndex, startIndex + studentsPerPage);

  const handleSelectStudent = (id) => {
    if (selectedStudents.includes(id)) {
      setSelectedStudents(selectedStudents.filter((studentId) => studentId !== id));
    } else {
      setSelectedStudents([...selectedStudents, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === currentStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(currentStudents.map((student) => student.id));
    }
  };

  const handleDeleteAll = () => {
    alert('Delete all selected students');
    setSelectedStudents([]);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedStudents([]);
  };

  const handleEdit = (studentId) => {
    router.push(`/admin/students/edit?studentId=${studentId}`);
  };

  const handleDelete = (studentId) => {
    if (confirm('Are you sure you want to delete this student?')) {
      alert(`Student with ID ${studentId} deleted successfully!`);
    }
  };

  if (filteredStudents.length === 0 && searchQuery) {
    return (
      <div className={styles.content}>
        <div className={styles.noStudents}>
          <div className={styles.koalaImage}>🐨 Z Z</div>
          <h2 className={styles.title}>No students found</h2>
          <p className={styles.description}>
            No students match your search criteria.
          </p>
        </div>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className={styles.content}>
        <div className={styles.noStudents}>
          <div className={styles.koalaImage}>🐨 Z Z</div>
          <h2 className={styles.title}>No students at this time</h2>
          <p className={styles.description}>
            Students will appear here after they enroll in your school.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Chỉ giữ lại một nút Add filter và ô tìm kiếm phía trên */}
      <div className={styles.header}>
        <button className={styles.filterButton}>Add filter ▼</button>
        <input
          type="text"
          placeholder="Search for a student by name or email" // Thay đổi placeholder
          className={styles.searchInputWide}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {selectedStudents.length > 0 && (
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
                  checked={selectedStudents.length === currentStudents.length && currentStudents.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th>Name</th>
              <th>Student ID</th>
              <th>Class</th>
              <th>Email address</th>
              <th>Operation</th>
            </tr>
          </thead>
          <tbody>
            {currentStudents.map((student) => (
              <tr key={student.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student.id)}
                    onChange={() => handleSelectStudent(student.id)}
                  />
                </td>
                <td className={styles.nameCell}>
                  <img
                    src="https://via.placeholder.com/40"
                    alt="Avatar"
                    className={styles.avatar}
                  />
                  {student.name}
                </td>
                <td>{student.studentId}</td>
                <td>
                  <button className={styles.classButton}>{student.class}</button>
                </td>
                <td>{student.email}</td>
                <td>
                  <button
                    className={styles.editButton}
                    onClick={() => handleEdit(student.id)}
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDelete(student.id)}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={styles.pagination}>
          <span>Showing {startIndex + 1}-{Math.min(startIndex + studentsPerPage, filteredStudents.length)}</span>
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
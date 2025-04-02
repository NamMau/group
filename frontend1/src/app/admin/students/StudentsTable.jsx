'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './students.module.css';

export default function StudentsTable() {
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const studentsPerPage = 5;

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:5000/api/users/get-students', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((err) => console.error('Error fetching students:', err));
  }, []);

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const startIndex = (currentPage - 1) * studentsPerPage;
  const currentStudents = filteredStudents.slice(startIndex, startIndex + studentsPerPage);

  const handleSelectStudent = (id) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((studentId) => studentId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedStudents(selectedStudents.length === currentStudents.length ? [] : currentStudents.map((s) => s.id));
  };

  const handleDelete = async (studentId) => {
    if (confirm('Are you sure you want to delete this student?')) {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:5000/api/users/delete-user/${studentId}`, { 
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (res.ok) {
          setStudents(students.filter((s) => s.id !== studentId));
        } else {
          alert('Failed to delete student');
        }
      } catch (err) {
        console.error('Error deleting student:', err);
      }
    }
  };

  const handleEdit = (studentId) => {
    router.push(`/admin/students/edit?studentId=${studentId}`);
  };

  return (
    <div>
      <div className={styles.header}>
        <button className={styles.filterButton}>Add filter ▼</button>
        <input
          type="text"
          placeholder="Search for a student by name or email"
          className={styles.searchInputWide}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>
                <input type="checkbox" checked={selectedStudents.length === currentStudents.length && currentStudents.length > 0} onChange={handleSelectAll} />
              </th>
              <th>Name</th>
              <th>Student ID</th>
              <th>Class</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentStudents.map((student) => (
              <tr key={student.id}>
                <td>
                  <input type="checkbox" checked={selectedStudents.includes(student.id)} onChange={() => handleSelectStudent(student.id)} />
                </td>
                <td className={styles.nameCell}>{student.name}</td>
                <td>{student.studentId}</td>
                <td>{student.class}</td>
                <td>{student.email}</td>
                <td>
                  <button className={styles.editButton} onClick={() => handleEdit(student.id)}>✏️</button>
                  <button className={styles.deleteButton} onClick={() => handleDelete(student.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

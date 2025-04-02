// 'use client';

// import { useState } from 'react';
// import styles from './teachers.module.css';
// import TeachersTable from './TeachersTable';
// import './metadata'; // Import để đảm bảo file metadata.jsx được tải, nhưng không export lại

// export default function Teachers() {
//   const [searchTerm, setSearchTerm] = useState('');

//   return (
//     <div className={styles.teachers}>
//       {/* Thanh tìm kiếm và bộ lọc */}
//       <div className={styles.header}>
//         <div className={styles.searchBar}>
//           <div className={styles.filter}>
//             <select className={styles.filterSelect}>
//               <option>Add filter</option>
//             </select>
//           </div>
//           <input
//             type="text"
//             placeholder="Search for a teacher by name or email"
//             className={styles.searchInput}
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* Bảng danh sách giáo viên */}
//       <TeachersTable searchTerm={searchTerm} />
//     </div>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import styles from './teachers.module.css';
import TeachersTable from './TeachersTable'; // Assuming you have this component
import './metadata'; // To ensure metadata.jsx is loaded, but not exported again

export default function Teachers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch tutors from the backend
  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users/get-tutors', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTutors(data); // Assuming the response is a list of tutors
        } else {
          alert('Failed to fetch tutors');
        }
      } catch (error) {
        console.error('Error fetching tutors:', error);
        alert('Error fetching tutors');
      }
      setLoading(false);
    };

    fetchTutors();
  }, []);

  // Filter tutors based on the search term
  const filteredTutors = tutors.filter((tutor) =>
    tutor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tutor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.teachers}>
      {/* Search and filter bar */}
      <div className={styles.header}>
        <div className={styles.searchBar}>
          <div className={styles.filter}>
            <select className={styles.filterSelect}>
              <option value="">Add filter</option>
              {/* You can add more filter options here */}
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

      {/* Tutors table */}
      <TeachersTable tutors={filteredTutors} loading={loading} />
    </div>
  );
}

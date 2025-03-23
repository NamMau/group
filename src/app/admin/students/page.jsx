import styles from './students.module.css';
import StudentsTable from './StudentsTable';

export const metadata = {
  title: 'Admin Students',
};

export default function Students() {
  return (
    <div className={styles.students}>
      {/* Thanh tìm kiếm */}
      <div className={styles.searchBar}>
        <div className={styles.filter}>
          <select>
            <option>Add filter</option>
          </select>
        </div>
        <input
          type="text"
          placeholder="Search for a students by name or email"
          className={styles.searchInput}
        />
      </div>

      {/* Bảng danh sách học sinh */}
      <StudentsTable />
    </div>
  );
}
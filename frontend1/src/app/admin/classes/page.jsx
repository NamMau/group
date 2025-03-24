import styles from './classes.module.css';
import ClassesTable from './ClassesTable';

export const metadata = {
  title: 'Admin Classes',
};

export default function Classes() {
  return (
    <div className={styles.classes}>
      {/* Thanh tìm kiếm */}
      <div className={styles.searchBar}>
        <div className={styles.filter}>
          <select>
            <option>Add filter</option>
          </select>
        </div>
        <input
          type="text"
          placeholder="Search for a classes by name or email"
          className={styles.searchInput}
        />
      </div>

      {/* Bảng danh sách lớp học */}
      <ClassesTable />
    </div>
  );
}
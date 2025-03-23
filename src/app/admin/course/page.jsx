import styles from './course.module.css';
import CourseTable from './CourseTable';

export const metadata = {
  title: 'Admin Course',
};

export default function Course() {
  return (
    <div className={styles.course}>
      {/* Thanh tìm kiếm */}
      <div className={styles.searchBar}>
        <div className={styles.filter}>
          <select>
            <option>Add filter</option>
          </select>
        </div>
        <input
          type="text"
          placeholder="Search for a course by name"
          className={styles.searchInput}
        />
      </div>

      {/* Bảng danh sách khóa học */}
      <CourseTable />
    </div>
  );
}
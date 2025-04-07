'use client';

import { useRouter, usePathname } from 'next/navigation';
import styles from './layout.module.css';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    alert('Logging out...');
    router.push('/admin/login');
  };

  if (pathname === '/admin/login') {
    return null;
  }

  return (
    <div className={styles.header}>
      <div className={styles.headerButtons}>
        <button className={styles.exportButton}>Export CSV</button>
        <Link href="/admin/teachers/add">
          <button className={styles.addButton}>Add Teachers</button>
        </Link>
        {pathname === '/admin/students' && (
          <button className={styles.addButton}>Add Student</button>
        )}
        {pathname === '/admin/classes' && (
          <button className={styles.addButton}>Add Classes</button>
        )}
        {pathname === '/admin/course' && (
          <button className={styles.addButton}>Add Course</button>
        )}
      </div>
      <div className={styles.headerActions}>
        <span className={styles.notificationIcon}>🔔</span>
        <button className={styles.logoutButton} onClick={handleLogout}>
          Log out
        </button>
      </div>
    </div>
  );
}
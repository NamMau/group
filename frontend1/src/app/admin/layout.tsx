'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import styles from './layout.module.css';
import type { ReactNode } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    alert('Logging out...');
    router.push('/admin/login');
  };

  // Bỏ qua layout cho các trang login, add, và edit
  if (
    pathname === '/admin/login' ||
    pathname === '/admin/teachers/add' ||
    pathname === '/admin/students/add' ||
    pathname === '/admin/classes/add' ||
    pathname === '/admin/course/add' ||
    pathname.startsWith('/admin/teachers/edit') ||
    pathname.startsWith('/admin/students/edit') ||
    pathname.startsWith('/admin/classes/edit') ||
    pathname.startsWith('/admin/course/edit') // Thêm điều kiện cho trang edit course
  ) {
    return <>{children}</>;
  }

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>OE</span>
          <span>eTutoring Systems</span>
        </div>
        <nav className={styles.nav}>
          <Link href="/admin/dashboard" className={pathname === '/admin/dashboard' ? styles.navItemActive : styles.navItem}>
            <span className={styles.icon}>🏠</span> Dashboard
          </Link>
          <Link href="/admin/teachers" className={pathname === '/admin/teachers' ? styles.navItemActive : styles.navItem}>
            <span className={styles.icon}>👨‍🏫</span> Teachers
          </Link>
          <Link href="/admin/students" className={pathname === '/admin/students' ? styles.navItemActive : styles.navItem}>
            <span className={styles.icon}>👩‍🎓</span> Students
          </Link>
          <Link href="/admin/classes" className={pathname === '/admin/classes' ? styles.navItemActive : styles.navItem}>
            <span className={styles.icon}>📚</span> Classes
          </Link>
          <Link href="/admin/course" className={pathname === '/admin/course' ? styles.navItemActive : styles.navItem}>
            <span className={styles.icon}>📚</span> Course
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className={styles.main}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerButtons}>
            <button className={styles.exportButton}>Export CSV</button>
            {pathname === '/admin/teachers' && (
              <Link href="/admin/teachers/add">
                <button className={styles.addButton}>Add Teachers</button>
              </Link>
            )}
            {pathname === '/admin/students' && (
              <Link href="/admin/students/add">
                <button className={styles.addButton}>Add Students</button>
              </Link>
            )}
            {pathname === '/admin/classes' && (
              <Link href="/admin/classes/add">
                <button className={styles.addButton}>Add Classes</button>
              </Link>
            )}
            {pathname === '/admin/course' && (
              <Link href="/admin/course/add">
                <button className={styles.addButton}>Add Course</button>
              </Link>
            )}
          </div>
          <div className={styles.headerActions}>
            <span className={styles.notificationIcon}>🔔</span>
            <button className={styles.logoutButton} onClick={handleLogout}>
              Log out
            </button>
          </div>
        </div>

        {/* Children */}
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
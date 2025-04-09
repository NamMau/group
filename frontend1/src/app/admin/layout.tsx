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
    if (confirm('Are you sure you want to log out?')) {
      localStorage.removeItem('token'); //delete token
      router.push('/admin/login');
    }
  };

  if (pathname.includes('/admin/') && (pathname.endsWith('/add') || pathname.includes('/edit'))) {
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
            <span className={styles.icon}>🏫</span> Classes
          </Link>
          <Link href="/admin/course" className={pathname === '/admin/course' ? styles.navItemActive : styles.navItem}>
            <span className={styles.icon}>📖</span> Course
          </Link>
          <Link href="/admin/meetings" className={pathname === '/admin/meetings' ? styles.navItemActive : styles.navItem}>
            <span className={styles.icon}>📺</span> Meetings
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className={styles.main}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerButtons}>
            <button className={styles.exportButton}>Export CSV</button>
            {['/admin/teachers', '/admin/students', '/admin/classes', '/admin/course', '/admin/meetings'].includes(pathname) && (
              <Link href={`${pathname}/add`}>
                <button className={styles.addButton}>Add {pathname.split('/').pop()}</button>
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

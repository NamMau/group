'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './layout.module.css';

export default function Sidebar() {
  const pathname = usePathname();

  if (pathname === '/admin/login') {
    return null;
  }

  return (
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
          <span className={styles.icon}>📖</span> Course
        </Link>
      </nav>
    </div>
  );
}
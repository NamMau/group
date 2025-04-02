'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './layout.module.css';

export default function Sidebar() {
  const pathname = usePathname();

  if (
    pathname === '/admin/login' ||
    pathname.includes('/admin/teachers/add') ||
    pathname.includes('/admin/students/add') ||
    pathname.includes('/admin/classes/add') ||
    pathname.includes('/admin/course/add') ||
    pathname.includes('/admin/teachers/edit') ||
    pathname.includes('/admin/students/edit') ||
    pathname.includes('/admin/classes/edit') ||
    pathname.includes('/admin/course/edit')
  ) {
    return null;
  }

  const navItems = [
    { href: '/admin/dashboard', icon: '🏠', label: 'Dashboard' },
    { href: '/admin/teachers', icon: '👨‍🏫', label: 'Teachers' },
    { href: '/admin/students', icon: '👩‍🎓', label: 'Students' },
    { href: '/admin/classes', icon: '🏫', label: 'Classes' },
    { href: '/admin/course', icon: '📖', label: 'Course' },
  ];

  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <span className={styles.logoIcon}>OE</span>
        <span>eTutoring Systems</span>
      </div>
      <nav className={styles.nav}>
        {navItems.map(({ href, icon, label }) => (
          <Link key={href} href={href} className={pathname.startsWith(href) ? styles.navItemActive : styles.navItem}>
            <span className={styles.icon}>{icon}</span> {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

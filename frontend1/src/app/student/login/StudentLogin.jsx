'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './login.module.css';
import { authService } from '../../../services/authService';

export default function StudentLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      // Sử dụng authService để đăng nhập
      const data = await authService.login(email, password);
      console.log('Login response:', data); // Để debug

      // Kiểm tra role
      if (data.user?.role !== 'student') {
        authService.removeToken(); // Xóa cả accessToken và refreshToken nếu không phải student
        throw new Error('Access denied. This login is for students only.');
      }

      // Chuyển hướng đến trang dashboard của sinh viên
      router.push('/student/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      // Xóa cả accessToken và refreshToken khi có lỗi
      authService.removeToken();
      
      if (error.message.includes('401')) {
        setError('Invalid email or password');
      } else if (error.message.includes('Access denied')) {
        setError('This login is for students only');
      } else {
        setError(error.message || 'Login failed. Please try again.');
      }
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h1 className={styles.title}>Student Login</h1>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className={styles.forgotPassword}>
            <Link href="/student/forgot-password">Forgot password?</Link>
          </div>

          <button type="submit" className={styles.loginButton}>
            Login
          </button>
        </form>

        <div className={styles.registerLink}>
          Don't have an account?
          <Link href="/student/register">Register here</Link>
        </div>
      </div>
    </div>
  );
}

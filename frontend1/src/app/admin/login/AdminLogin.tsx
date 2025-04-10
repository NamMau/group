'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';
import { authService } from '../../../services/authService';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const token = authService.getToken();
      const user = authService.getUser();

      if (token && user) {
        if (user.role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          // Clear invalid session
          authService.removeToken();
        }
      }
    };

    checkAuth();
  }, [router]);

  const validateForm = () => {
    if (!email) {
      setError('Email is required');
      return false;
    }
    if (!password) {
      setError('Password is required');
      return false;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setError('');
      setLoading(true);

      // Login using authService
      const data = await authService.login(email, password);

      // Check if user is a admin
      if (data?.user?.role !== 'admin') {
        authService.removeToken();
        throw new Error('Access denied. This login is for admins only.');
      }

      // Clear form
      setEmail('');
      setPassword('');

      // Navigate to dashboard
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h1 className={styles.title}>Welcome, Log in to your account</h1>
      <div className={styles.loginBox}>
        <p className={styles.welcomeMessage}>It is our great pleasure to have you on board!</p>
        {error && <p className={styles.errorMessage}>{error}</p>}
        <input
          type="text"
          placeholder="Enter your email"
          className={styles.inputField}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter Password"
          className={styles.inputField}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className={`${styles.loginButton} ${loading ? styles.loading : ''}`}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </div>
    </div>
  );
}
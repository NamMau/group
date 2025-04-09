'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './login.module.css';
import { authService } from '../../../services/authService';

export default function StudentLogin() {
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
        if (user.role === 'student') {
          router.push('/student/dashboard');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setError('');
      setLoading(true);
      
      // Login using authService
      const data = await authService.login(email, password);
      
      // Check if user is a student
      if (data.user && data.user.role !== 'student') {
        authService.removeToken();
        throw new Error('Access denied. This login is for students only.');
      }

      // Clear form
      setEmail('');
      setPassword('');

      // Navigate to dashboard
      router.push('/student/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      authService.removeToken();
      
      // Handle specific error messages
      const errorMessage = error.message.toLowerCase();
      if (errorMessage.includes('network error')) {
        setError('Unable to connect to server. Please check your internet connection.');
      } else if (errorMessage.includes('invalid email or password')) {
        setError('Invalid email or password');
      } else if (errorMessage.includes('access denied')) {
        setError('This login is for students only');
      } else {
        setError(error.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h1 className={styles.title}>Student Login</h1>
        
        {error && (
          <div className={styles.error}>
            <p>{error}</p>
            <button 
              onClick={() => setError('')}
              className={styles.errorClose}
              aria-label="Close error message"
            >
              ×
            </button>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className={styles.input}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              required
              disabled={loading}
              autoComplete="email"
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
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              required
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          <div className={styles.forgotPassword}>
            <Link href="/student/forgot-password">Forgot password?</Link>
          </div>

          <button 
            type="submit" 
            className={`${styles.loginButton} ${loading ? styles.loading : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className={styles.spinner} />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className={styles.registerLink}>
          Don't have an account?{' '}
          <Link href="/student/register">Register here</Link>
        </div>
      </div>
    </div>
  );
}

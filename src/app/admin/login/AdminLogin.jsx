'use client';

import { useState } from 'react';
import styles from './login.module.css';

export default function AdminLogin() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!name || !password) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    alert(`Name: ${name}, Password: ${password}`);
  };

  return (
    <div className={styles.loginContainer}>
      <h1 className={styles.title}>Welcome, Log in to your account</h1>
      <div className={styles.loginBox}>
        <p className={styles.welcomeMessage}>It is our great pleasure to have you on board!</p>
        {error && <p className={styles.errorMessage}>{error}</p>}
        <input
          type="text"
          placeholder="Enter the name"
          className={styles.inputField}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter Password"
          className={styles.inputField}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className={styles.loginButton} onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
}
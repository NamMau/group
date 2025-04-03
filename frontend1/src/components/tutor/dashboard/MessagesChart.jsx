'use client';

import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import styles from './MessagesChart.module.css';
import { chatService } from '../../../services/chatService';

export default function MessagesChart() {
  const [messageData, setMessageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessageStats = async () => {
      try {
        const data = await chatService.getMessageStats();
        setMessageData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessageStats();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading message statistics...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.title}>Message Activity</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={messageData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="sent" fill="#3b82f6" name="Messages Sent" />
          <Bar dataKey="received" fill="#10b981" name="Messages Received" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
} 
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { meetingService } from '@/services/meetingService';
import styles from '../../meetings.module.css';

interface EditMeetingFormProps {
  meetingId: string;
}

interface FormData {
  date: string;
  time: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export default function EditMeetingForm({ meetingId }: EditMeetingFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    date: '',
    time: '',
    duration: 60,
    status: 'scheduled',
    notes: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMeetingData();
  }, [meetingId]);

  const fetchMeetingData = async () => {
    try {
      const meeting = await meetingService.getMeeting(meetingId);
      const date = new Date(meeting.date);
      setFormData({
        date: date.toISOString().split('T')[0],
        time: date.toTimeString().split(' ')[0].slice(0, 5),
        duration: meeting.duration,
        status: meeting.status,
        notes: meeting.notes || ''
      });
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch meeting data');
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dateTime = new Date(`${formData.date}T${formData.time}`);
      
      await meetingService.updateMeeting(meetingId, {
        date: dateTime,
        duration: Number(formData.duration),
        status: formData.status,
        notes: formData.notes
      });

      toast.success('Meeting updated successfully');
      router.push('/admin/meetings');
    } catch (err) {
      toast.error('Failed to update meeting');
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="time">Time</label>
          <input
            type="time"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="duration">Duration (minutes)</label>
          <input
            type="number"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            min="15"
            step="15"
            className={styles.input}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={styles.select}
            required
          >
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="notes">Notes (Optional)</label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          className={styles.textarea}
        />
      </div>

      <div className={styles.formActions}>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Meeting'}
        </button>
      </div>
    </form>
  );
} 
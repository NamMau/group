"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import TimeSlot from "@/components/student/appointment/TimeSlot";
import CustomDatePicker from "@/components/student/appointment/CustomDatePicker";
import Button from "@/components/student/appointment/Button";

interface Course {
  _id: string;
  name: string;
  description: string;
  category: string;
  level: string;
  startDate: string;
  endDate: string;
  tutor: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    avatar: string;
  };
  students: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Tutor {
  _id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  courses: string[];
}

interface AppointmentFormProps {
  onSubmit: (appointment: any) => void;
}

const AppointmentForm = ({ onSubmit }: AppointmentFormProps) => {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [appointment, setAppointment] = useState({
    title: '',
    description: '',
    type: 'online',
    course: '',
    tutor: '',
    date: '',
    startTime: '',
    endTime: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please login to book an appointment');
          return;
        }

        // Fetch tutors
        const tutorsRes = await axios.get('http://localhost:5000/api/v1/users/get-tutors', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTutors(tutorsRes.data.data);

        // Fetch all courses
        const coursesRes = await axios.get('http://localhost:5000/api/v1/courses', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCourses(coursesRes.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchCourse = async () => {
    if (!searchTerm.trim()) {
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to search courses');
        return;
      }

      const courseRes = await axios.get(`http://localhost:5000/api/v1/courses/getcoursebyname/${searchTerm}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(courseRes.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to search courses');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate required fields
    if (!appointment.title || !appointment.description || !appointment.course || 
        !appointment.tutor || !appointment.date || !appointment.startTime || 
        !appointment.endTime) {
      setError('Please fill in all required fields');
      return;
    }

    // Validate time slots
    const startTime = new Date(`1970-01-01T${appointment.startTime}`);
    const endTime = new Date(`1970-01-01T${appointment.endTime}`);
    if (startTime >= endTime) {
      setError('End time must be after start time');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      
      if (!token || !userData._id) {
        setError('Please login to book an appointment');
        return;
      }

      const response = await axios.post(
        'http://localhost:5000/api/v1/appointments/create-appointment',
        {
          title: appointment.title,
          description: appointment.description,
          type: appointment.type,
          course: appointment.course,
          tutor: appointment.tutor,
          student: userData._id,
          date: appointment.date,
          startTime: appointment.startTime,
          endTime: appointment.endTime,
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      onSubmit(response.data.data);
      router.push('/student/appointments');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create appointment');
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-md">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Title *
        </label>
        <input
          type="text"
          value={appointment.title}
          onChange={(e) => setAppointment({ ...appointment, title: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description *
        </label>
        <textarea
          value={appointment.description}
          onChange={(e) => setAppointment({ ...appointment, description: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          rows={3}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Type *
        </label>
        <select
          value={appointment.type}
          onChange={(e) => setAppointment({ ...appointment, type: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
        >
          <option value="online">Online</option>
          <option value="offline">Offline</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Search Course *
        </label>
        <div className="mt-1 flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter course name to search"
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            required
          />
          <Button
            text="Search"
            onClick={handleSearchCourse}
            primary
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Course *
        </label>
        <select
          value={appointment.course}
          onChange={(e) => setAppointment({ ...appointment, course: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          required
        >
          <option value="">Select a course</option>
          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Tutor *
        </label>
        <select
          value={appointment.tutor}
          onChange={(e) => setAppointment({ ...appointment, tutor: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          required
        >
          <option value="">Select a tutor</option>
          {tutors.map((tutor) => (
            <option key={tutor._id} value={tutor._id}>
              {tutor.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Date *
        </label>
        <input
          type="date"
          value={appointment.date}
          onChange={(e) => setAppointment({ ...appointment, date: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          min={new Date().toISOString().split('T')[0]}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <TimeSlot
          label="Start Time *"
          value={appointment.startTime}
          onChange={(value) => setAppointment({ ...appointment, startTime: value })}
        />
        <TimeSlot
          label="End Time *"
          value={appointment.endTime}
          onChange={(value) => setAppointment({ ...appointment, endTime: value })}
        />
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          text="Cancel"
          onClick={() => window.history.back()}
        />
        <Button
          text="Book Appointment"
          onClick={() => handleSubmit(new Event('submit') as any)}
          primary
        />
      </div>
    </form>
  );
};

export default AppointmentForm;

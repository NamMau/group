"use client";
import { useState, useEffect } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import AppointmentList from "./AppointmentList";
import { FaCalendarAlt } from "react-icons/fa";
import axios from "axios";

interface Appointment {
  _id: string;
  date: string;
  status: string;
}

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, [currentDate]);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const tutorId = localStorage.getItem('userId');
      
      if (!token || !tutorId) {
        throw new Error('Authentication required');
      }

      const response = await axios.get(`http://localhost:5000/api/appointments/tutor/${tutorId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          month: currentDate.getMonth() + 1,
          year: currentDate.getFullYear()
        }
      });

      setAppointments(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch appointments');
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const hasAppointments = (day: number) => {
    const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return appointments.some(apt => apt.date === dateString);
  };

  const getAppointmentStatus = (day: number) => {
    const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayAppointments = appointments.filter(apt => apt.date === dateString);
    if (dayAppointments.length === 0) return null;
    
    const hasOngoing = dayAppointments.some(apt => apt.status === 'ongoing');
    const hasScheduled = dayAppointments.some(apt => apt.status === 'scheduled');
    
    if (hasOngoing) return 'bg-green-100';
    if (hasScheduled) return 'bg-blue-100';
    return 'bg-gray-100';
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="bg-white shadow-md p-4 rounded-lg w-full max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Calendar Section */}
        <div className="w-full md:w-72">
          {/* Header */}
          <div className="flex justify-between items-center text-brown-700 font-semibold mb-4">
            <button 
              onClick={handlePrevMonth}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <IoChevronBack size={20} />
            </button>
            <span className="flex items-center gap-2">
              <FaCalendarAlt className="text-orange-500" />
              {formatMonthYear(currentDate)}
            </span>
            <button 
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <IoChevronForward size={20} />
            </button>
          </div>

          {/* Week Days */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
              <div key={index} className="text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {[...Array(getFirstDayOfMonth(currentDate))].map((_, i) => (
              <div key={`empty-${i}`} className="h-10" />
            ))}
            {[...Array(getDaysInMonth(currentDate))].map((_, i) => {
              const day = i + 1;
              const isSelected = selectedDate.getDate() === day && 
                               selectedDate.getMonth() === currentDate.getMonth() &&
                               selectedDate.getFullYear() === currentDate.getFullYear();
              
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                  className={`
                    h-10 rounded-full text-sm font-medium
                    ${isSelected ? 'bg-orange-500 text-white' : 'hover:bg-gray-100'}
                    ${hasAppointments(day) ? getAppointmentStatus(day) : ''}
                    ${day === new Date().getDate() && 
                      currentDate.getMonth() === new Date().getMonth() && 
                      currentDate.getFullYear() === new Date().getFullYear() 
                      ? 'border-2 border-orange-500' : ''}
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Appointments Section */}
        <div className="flex-1">
          <AppointmentList selectedDate={selectedDate} />
        </div>
      </div>
    </div>
  );
};

export default Calendar;

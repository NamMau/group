'use client';
import React, { useState, useEffect } from "react";
import { FaVideo, FaClock, FaUser, FaCalendarAlt } from "react-icons/fa";
import { Appointment, appointmentService } from "@/services/appointmentService";
import { authService } from "@/services/authService";

interface AppointmentListProps {
  selectedDate: Date;
}

const AppointmentList: React.FC<AppointmentListProps> = ({ selectedDate }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, [selectedDate]);

  const fetchAppointments = async () => {
    try {
      const user = authService.getUser();
      if (!user || user.role !== 'tutor') throw new Error('Missing tutor user');

      const allAppointments = await appointmentService.getAppointmentsByTutor(user._id);
      const formattedDate = selectedDate.toISOString().split('T')[0];
      const filtered = allAppointments.filter(
        (appt) => appt.date.split('T')[0] === formattedDate
      );

      setAppointments(filtered);
      setError(null);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Không thể tải danh sách lịch hẹn');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleJoinMeeting = (meetingLink: string) => {
    if (meetingLink) window.open(meetingLink, '_blank');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b">
        <div className="flex items-center space-x-2">
          <FaCalendarAlt className="text-orange-500" />
          <input
            type="date"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={(e) => {
              const newDate = new Date(e.target.value);
              // Nếu selectedDate đến từ cha, bạn nên sử dụng callback để cập nhật
            }}
            className="border rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      <div className="divide-y">
        {appointments.length === 0 ? (
          <div className="p-4 text-center text-gray-500">Không có lịch hẹn nào cho ngày này</div>
        ) : (
          appointments.map((appointment) => (
            <div key={appointment._id} className="p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <FaUser className="text-orange-500" />
                    <div>
                      {typeof appointment.student === 'string' ? (
                        <span className="font-medium text-gray-800">Không rõ sinh viên</span>
                      ) : (
                        <div className="text-gray-800">
                          <div className="font-medium">{appointment.student.fullName}</div>
                          <div className="text-sm text-gray-500">{appointment.student.email}</div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <FaClock className="text-orange-500" />
                    <span>{formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </span>
                  {appointment.status === 'confirmed' && appointment.meetingLink && (
                    <button
                      onClick={() => handleJoinMeeting(appointment.meetingLink!)}
                      className="flex items-center space-x-1 bg-orange-500 text-white px-3 py-1 rounded-md hover:bg-orange-600 transition-colors"
                    >
                      <FaVideo />
                      <span>Join</span>
                    </button>
                  )}
                </div>
              </div>
              {appointment.notes && (
                <div className="mt-2 text-sm text-gray-600">
                  Ghi chú: {appointment.notes}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AppointmentList;

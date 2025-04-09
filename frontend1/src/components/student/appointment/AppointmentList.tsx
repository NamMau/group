import { useEffect, useState } from "react";
import { FiSearch, FiRefreshCw } from "react-icons/fi";
import AppointmentCard from "@/components/student/appointment/AppointmentCard";
import {
  appointmentService,
  Appointment as ServiceAppointment,
} from "@/services/appointmentService";
import { authService } from "@/services/authService";

// Interface được AppointmentCard sử dụng
interface CardAppointment {
  _id: string;
  title: string;
  description: string;
  type: "online" | "offline";
  tutor: {
    _id: string;
    fullName: string;
  };
  student: {
    _id: string;
    fullName: string;
  };
  date: string;
  startTime: string;
  endTime: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  createdAt: string;
  updatedAt: string;
  location?: string;
  meetingLink?: string;
  notes?: string;
}

const AppointmentList: React.FC = () => {
  const [appointments, setAppointments] = useState<CardAppointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<CardAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<CardAppointment["status"] | "all">("all");

  const fetchAppointments = async () => {
    try {
      setLoading(true);

      const userData = authService.getUser();
      const token = authService.getToken();

      if (!token || !userData?._id) {
        setError("Please login to view appointments");
        return;
      }

      const response = await appointmentService.getAppointmentsByStudent(userData._id);

      const transformedAppointments: CardAppointment[] = response.map((app) => {
        const tutorObj =
          typeof app.tutor === "string"
            ? { _id: app.tutor, fullName: "Unknown Tutor" }
            : {
                _id: app.tutor._id,
                fullName: (app.tutor as any).fullName || (app.tutor as any).name || "Unknown Tutor",
              };
      
        const studentObj =
          typeof app.student === "string"
            ? { _id: app.student, fullName: "Unknown Student" }
            : {
                _id: app.student._id,
                fullName: (app.student as any).fullName || (app.student as any).name || "Unknown Student",
              };
      
        return {
          _id: app._id || "",
          title: app.title,
          description: app.description || "",
          type: app.type,
          tutor: tutorObj,
          student: studentObj,
          date: app.date,
          startTime: app.startTime,
          endTime: app.endTime,
          status: app.status,
          createdAt: app.createdAt || "",
          updatedAt: app.updatedAt || "",
          location: app.location,
          meetingLink: app.meetingLink,
          notes: app.notes,
        };
      });
      

      setAppointments(transformedAppointments);
      setFilteredAppointments(transformedAppointments);
    } catch (err: any) {
      console.error("Error fetching appointments:", err);
      setError(typeof err === "string" ? err : "Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    let filtered = [...appointments];

    if (searchTerm) {
      filtered = filtered.filter(
        (appointment) =>
          appointment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          appointment.tutor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (appointment.location || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((appointment) => appointment.status === statusFilter);
    }

    setFilteredAppointments(filtered);
  }, [searchTerm, statusFilter, appointments]);

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      await appointmentService.updateAppointmentStatus(appointmentId, "cancelled");
      fetchAppointments(); // reload lại list
    } catch (err) {
      console.error("Error canceling appointment:", err);
      setError(typeof err === "string" ? err : "Failed to cancel appointment");
    }
  };

  const handleEditAppointment = async (
    appointmentId: string,
    newStatus: "pending" | "confirmed" | "cancelled" | "completed"
  ) => {
    try {
      await appointmentService.updateAppointmentStatus(appointmentId, newStatus);
      fetchAppointments(); // reload lại list
    } catch (err) {
      console.error("Error updating appointment:", err);
      setError(typeof err === "string" ? err : "Failed to update appointment");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-500 rounded-lg">
        <p className="font-semibold">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Bộ lọc và tìm kiếm */}
      <div className="flex flex-col md:flex-row gap-4 p-4 bg-white rounded-lg shadow">
        <div className="flex-1">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as CardAppointment["status"] | "all")}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>
        <button
          onClick={fetchAppointments}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center gap-2"
        >
          <FiRefreshCw className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Danh sách cuộc hẹn */}
      {filteredAppointments.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          <p>No appointments found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          {filteredAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment._id}
              appointment={appointment}
              onEdit={(appointment, newStatus) =>
                handleEditAppointment(appointment._id, newStatus)
              }
              onCancel={handleCancelAppointment}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentList;

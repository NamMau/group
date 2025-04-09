"use client";
import { useState, useEffect } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import AppointmentList from "./AppointmentList";
import { FaCalendarAlt } from "react-icons/fa";
import { appointmentService, Appointment } from "@/services/appointmentService";
import { authService } from "@/services/authService";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const user = authService.getUser();
      if (!user || user.role !== "tutor") throw new Error("Tutor user not found");

      const allAppointments = await appointmentService.getAppointmentsByTutor(user._id);
      setAppointments(allAppointments);
      setError(null);
    } catch (err) {
      setError("Không thể tải danh sách lịch hẹn.");
      console.error("Error fetching appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const getFirstDayOfMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const hasAppointments = (day: number) => {
    const dateString = formatDateString(currentDate, day);
    return appointments.some((apt) => apt.date.startsWith(dateString));
  };

  const getAppointmentStatus = (day: number) => {
    const dateString = formatDateString(currentDate, day);
    const dayAppointments = appointments.filter((apt) => apt.date.startsWith(dateString));

    if (dayAppointments.length === 0) return null;

    const hasPending = dayAppointments.some((apt) => apt.status === "pending");
    const hasCompleted = dayAppointments.some((apt) => apt.status === "completed");

    if (hasPending) return "bg-green-100";
    if (hasCompleted) return "bg-blue-100";
    return "bg-gray-100";
  };

  const formatDateString = (date: Date, day: number) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleString("default", { month: "long", year: "numeric" });
  };

  return (
    <div className="bg-white shadow-md p-4 rounded-lg w-full max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Calendar */}
        <div className="w-full md:w-72">
          <div className="flex justify-between items-center text-brown-700 font-semibold mb-4">
            <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 rounded-full">
              <IoChevronBack size={20} />
            </button>
            <span className="flex items-center gap-2">
              <FaCalendarAlt className="text-orange-500" />
              {formatMonthYear(currentDate)}
            </span>
            <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded-full">
              <IoChevronForward size={20} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-2">
            {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
              <div key={index} className="text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {[...Array(getFirstDayOfMonth(currentDate))].map((_, i) => (
              <div key={`empty-${i}`} className="h-10" />
            ))}
            {[...Array(getDaysInMonth(currentDate))].map((_, i) => {
              const day = i + 1;
              const isSelected =
                selectedDate.getDate() === day &&
                selectedDate.getMonth() === currentDate.getMonth() &&
                selectedDate.getFullYear() === currentDate.getFullYear();

              return (
                <button
                  key={day}
                  onClick={() =>
                    setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))
                  }
                  className={`h-10 rounded-full text-sm font-medium
                    ${isSelected ? "bg-orange-500 text-white" : "hover:bg-gray-100"}
                    ${hasAppointments(day) ? getAppointmentStatus(day) : ""}
                    ${
                      day === new Date().getDate() &&
                      currentDate.getMonth() === new Date().getMonth() &&
                      currentDate.getFullYear() === new Date().getFullYear()
                        ? "border-2 border-orange-500"
                        : ""
                    }
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Appointment List */}
        <div className="flex-1">
          <AppointmentList selectedDate={selectedDate} />
        </div>
      </div>
    </div>
  );
};

export default Calendar;

// "use client";
// import { useState, useEffect } from "react";
// import { IoChevronBack, IoChevronForward } from "react-icons/io5";
// import AppointmentList from "./AppointmentList";
// import { FaCalendarAlt } from "react-icons/fa";
// import { appointmentService, Appointment } from "@/services/appointmentService";
// import { authService } from "@/services/authService";

// const Calendar = () => {
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [appointments, setAppointments] = useState<Appointment[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     fetchAppointments();
//   }, []);

//   const fetchAppointments = async () => {
//     try {
//       const user = authService.getUser();
//       if (!user || user.role !== "tutor") throw new Error("Tutor user not found");

//       const response = await appointmentService.getAppointmentsByTutor(user._id);
//       const allAppointments = Array.isArray(response)
//         ? response
//         : Array.isArray(response?.data)
//         ? response.data
//         : [];

//       setAppointments(allAppointments);
//       setError(null);
//     } catch (err) {
//       setError("Không thể tải danh sách lịch hẹn.");
//       console.error("Error fetching appointments:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getDaysInMonth = (date: Date) =>
//     new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

//   const getFirstDayOfMonth = (date: Date) =>
//     new Date(date.getFullYear(), date.getMonth(), 1).getDay();

//   const handlePrevMonth = () => {
//     setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
//   };

//   const handleNextMonth = () => {
//     setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
//   };

//   const hasAppointments = (day: number) => {
//     if (!Array.isArray(appointments)) return false;

//     const dateString = formatDateString(currentDate, day);
//     return appointments.some((apt) => apt.date.startsWith(dateString));
//   };

//   const getAppointmentStatus = (day: number) => {
//     if (!Array.isArray(appointments)) return null;

//     const dateString = formatDateString(currentDate, day);
//     const dayAppointments = appointments.filter((apt) => apt.date.startsWith(dateString));

//     if (dayAppointments.length === 0) return null;

//     const hasPending = dayAppointments.some((apt) => apt.status === "pending");
//     const hasCompleted = dayAppointments.some((apt) => apt.status === "completed");

//     if (hasPending) return "bg-green-100";
//     if (hasCompleted) return "bg-blue-100";
//     return "bg-gray-100";
//   };

//   const formatDateString = (date: Date, day: number) => {
//     return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
//   };

//   const formatMonthYear = (date: Date) => {
//     return date.toLocaleString("default", { month: "long", year: "numeric" });
//   };

//   return (
//     <div className="bg-white shadow-md p-4 rounded-lg w-full max-w-4xl mx-auto">
//       <div className="flex flex-col md:flex-row gap-4">
//         {/* Calendar */}
//         <div className="w-full md:w-72">
//           <div className="flex justify-between items-center text-brown-700 font-semibold mb-4">
//             <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 rounded-full">
//               <IoChevronBack size={20} />
//             </button>
//             <span className="flex items-center gap-2">
//               <FaCalendarAlt className="text-orange-500" />
//               {formatMonthYear(currentDate)}
//             </span>
//             <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded-full">
//               <IoChevronForward size={20} />
//             </button>
//           </div>

//           <div className="grid grid-cols-7 gap-2 mb-2">
//             {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
//               <div key={index} className="text-center text-sm font-medium text-gray-500">
//                 {day}
//               </div>
//             ))}
//           </div>

//           <div className="grid grid-cols-7 gap-2">
//             {[...Array(getFirstDayOfMonth(currentDate))].map((_, i) => (
//               <div key={`empty-${i}`} className="h-10" />
//             ))}
//             {[...Array(getDaysInMonth(currentDate))].map((_, i) => {
//               const day = i + 1;
//               const isSelected =
//                 selectedDate.getDate() === day &&
//                 selectedDate.getMonth() === currentDate.getMonth() &&
//                 selectedDate.getFullYear() === currentDate.getFullYear();

//               return (
//                 <button
//                   key={day}
//                   onClick={() =>
//                     setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))
//                   }
//                   className={`h-10 rounded-full text-sm font-medium
//                     ${isSelected ? "bg-orange-500 text-white" : "hover:bg-gray-100"}
//                     ${hasAppointments(day) ? getAppointmentStatus(day) : ""}
//                     ${
//                       day === new Date().getDate() &&
//                       currentDate.getMonth() === new Date().getMonth() &&
//                       currentDate.getFullYear() === new Date().getFullYear()
//                         ? "border-2 border-orange-500"
//                         : ""
//                     }
//                   `}
//                 >
//                   {day}
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         {/* Appointment List */}
//         <div className="flex-1">
//           <AppointmentList selectedDate={selectedDate} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Calendar;


// "use client";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import TimeSlot from "@/components/student/appointment/TimeSlot";
// import Button from "@/components/student/appointment/Button";
// import { authService } from "@/services/authService";
// import { userService } from "@/services/userService";
// import { appointmentService } from "@/services/appointmentService";

// // Đổi tên Tutor thành LocalTutor để tránh xung đột
// interface LocalTutor {
//   _id: string;
//   fullName: string;
//   email: string;
//   phoneNumber?: string;
//   avatar: string;
// }

// type AppointmentType = 'online' | 'offline';

// export interface AppointmentInput {
//   title: string;
//   description: string;
//   type: AppointmentType;
//   tutor: string;
//   date: string;
//   startTime: string;
//   endTime: string;
//   location?: 'startup room' | 'main office' | 'college office';
//   meetingLink?: string;
//   notes?: string;
// }

// interface AppointmentFormProps {
//   onSubmit: (appointment: any) => void;
// }

// const AppointmentForm = ({ onSubmit }: AppointmentFormProps) => {
//   const router = useRouter();
//   const [tutors, setTutors] = useState<LocalTutor[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const [appointment, setAppointment] = useState<AppointmentInput>({
//     title: '',
//     description: '',
//     type: 'online',
//     tutor: '',
//     date: '',
//     startTime: '',
//     endTime: '',
//     location: 'startup room',
//     meetingLink: 'meet.google.com/ind-xbrr-jtp',
//   });

//   useEffect(() => {
//     const fetchTutors = async () => {
//       try {
//         const tutorList = await userService.getTutors();
//         const mappedTutors: LocalTutor[] = tutorList.map((tutor) => ({
//           _id: tutor._id,
//           fullName: tutor.fullName,
//           email: tutor.email,
//           phoneNumber: tutor.phoneNumber,
//           avatar: tutor.avatar || "",
//         }));
//         setTutors(mappedTutors);
//       } catch (err: any) {
//         setError(err.message || 'Failed to fetch tutors');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchTutors();
//   }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);

//     const { title, description, tutor, date, startTime, endTime, type, meetingLink, location } = appointment;

//     if (!title || !description || !tutor || !date || !startTime || !endTime) {
//       setError('Please fill in all required fields');
//       return;
//     }

//     if (type === 'online' && !meetingLink) {
//       setError('Meeting link is required for online appointments');
//       return;
//     }

//     if (type === 'offline' && !location) {
//       setError('Location is required for offline appointments');
//       return;
//     }

//     const start = new Date(`1970-01-01T${startTime}`);
//     const end = new Date(`1970-01-01T${endTime}`);
//     if (start >= end) {
//       setError('End time must be after start time');
//       return;
//     }

//     try {
//       const user = authService.getUser();
//       if (!user?._id) {
//         setError('User information not found. Please login again.');
//         return;
//       }

//       const newAppointmentData: AppointmentInput & { student: string } = {
//         title,
//         description,
//         type,
//         tutor,
//         student: user._id,
//         date,
//         startTime,
//         endTime,
//         ...(type === 'online'
//           ? { meetingLink }
//           : { location }),
//       };

//       const newAppointment = await appointmentService.createAppointment(newAppointmentData);

//       onSubmit(newAppointment);
//       router.push('/student/appointments');
//     } catch (err: any) {
//       setError(err.message || 'Failed to create appointment');
//     }
//   };

//   if (loading) return <div className="text-center py-4">Loading...</div>;

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       {error && (
//         <div className="bg-red-50 text-red-500 p-3 rounded-md">
//           {error}
//         </div>
//       )}

//       <div>
//         <label className="block text-sm font-medium text-gray-700">Title *</label>
//         <input
//           type="text"
//           value={appointment.title}
//           onChange={(e) => setAppointment({ ...appointment, title: e.target.value })}
//           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
//           required
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700">Description *</label>
//         <textarea
//           value={appointment.description}
//           onChange={(e) => setAppointment({ ...appointment, description: e.target.value })}
//           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
//           rows={3}
//           required
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700">Type *</label>
//         <select
//           value={appointment.type}
//           onChange={(e) =>
//             setAppointment({
//               ...appointment,
//               type: e.target.value as AppointmentType,
//               // reset location/meetingLink khi thay đổi type
//               ...(e.target.value === 'online'
//                 ? { location: undefined, meetingLink: '' }
//                 : { location: 'startup room', meetingLink: undefined }),
//             })
//           }
//           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
//         >
//           <option value="online">Online</option>
//           <option value="offline">Offline</option>
//         </select>
//       </div>

//       {appointment.type === 'online' ? (
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Meeting Link *</label>
//           <input
//             type="text"
//             value={appointment.meetingLink || ''}
//             onChange={(e) => setAppointment({ ...appointment, meetingLink: e.target.value })}
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
//             required
//           />
//         </div>
//       ) : (
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Location *</label>
//           <select
//             value={appointment.location}
//             onChange={(e) => setAppointment({ ...appointment, location: e.target.value as any })}
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
//             required
//           >
//             <option value="startup room">Startup Room</option>
//             <option value="main office">Main Office</option>
//             <option value="college office">College Office</option>
//           </select>
//         </div>
//       )}

//       <div>
//         <label className="block text-sm font-medium text-gray-700">Tutor *</label>
//         <select
//           value={appointment.tutor}
//           onChange={(e) => setAppointment({ ...appointment, tutor: e.target.value })}
//           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
//           required
//         >
//           <option value="">Select a tutor</option>
//           {tutors.map((tutor) => (
//             <option key={tutor._id} value={tutor._id}>{tutor.fullName}</option>
//           ))}
//         </select>
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700">Date *</label>
//         <input
//           type="date"
//           value={appointment.date}
//           onChange={(e) => setAppointment({ ...appointment, date: e.target.value })}
//           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
//           min={new Date().toISOString().split('T')[0]}
//           required
//         />
//       </div>

//       <div className="grid grid-cols-2 gap-4">
//         <TimeSlot
//           label="Start Time *"
//           value={appointment.startTime}
//           onChange={(value) => setAppointment({ ...appointment, startTime: value })}
//         />
//         <TimeSlot
//           label="End Time *"
//           value={appointment.endTime}
//           onChange={(value) => setAppointment({ ...appointment, endTime: value })}
//         />
//       </div>

//       <div className="flex justify-end space-x-4">
//         <Button text="Cancel" onClick={() => window.history.back()} />
//         <Button text="Book Appointment" type="submit" primary />
//       </div>
//     </form>
//   );
// };

// export default AppointmentForm;

"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TimeSlot from "@/components/student/appointment/TimeSlot";
import Button from "@/components/student/appointment/Button";
import { authService } from "@/services/authService";
import { userService } from "@/services/userService";
import { appointmentService } from "@/services/appointmentService";

// Tutor object đầy đủ
interface LocalTutor {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  avatar: string;
}

type AppointmentType = "online" | "offline";

export interface AppointmentInput {
  title: string;
  description: string;
  type: AppointmentType;
  tutor: LocalTutor; // 👈 thay vì string
  date: string;
  startTime: string;
  endTime: string;
  location?: "startup room" | "main office" | "college office";
  meetingLink?: string;
  notes?: string;
}

interface AppointmentFormProps {
  onSubmit: (appointment: any) => void;
}

const AppointmentForm = ({ onSubmit }: AppointmentFormProps) => {
  const router = useRouter();
  const [tutors, setTutors] = useState<LocalTutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [appointment, setAppointment] = useState<AppointmentInput>({
    title: "",
    description: "",
    type: "online",
    tutor: {} as LocalTutor, // 👈 mặc định rỗng
    date: "",
    startTime: "",
    endTime: "",
    location: "startup room",
    meetingLink: "meet.google.com/ind-xbrr-jtp",
  });

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const tutorList = await userService.getTutors();
        const mappedTutors: LocalTutor[] = tutorList.map((tutor) => ({
          _id: tutor._id,
          fullName: tutor.fullName,
          email: tutor.email,
          phoneNumber: tutor.phoneNumber,
          avatar: tutor.avatar || "",
        }));
        setTutors(mappedTutors);
      } catch (err: any) {
        setError(err.message || "Failed to fetch tutors");
      } finally {
        setLoading(false);
      }
    };
    fetchTutors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { title, description, tutor, date, startTime, endTime, type, meetingLink, location } = appointment;

    if (!title || !description || !tutor?._id || !date || !startTime || !endTime) {
      setError("Please fill in all required fields");
      return;
    }

    if (type === "online" && !meetingLink) {
      setError("Meeting link is required for online appointments");
      return;
    }

    if (type === "offline" && !location) {
      setError("Location is required for offline appointments");
      return;
    }

    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);
    if (start >= end) {
      setError("End time must be after start time");
      return;
    }

    try {
      const user = authService.getUser();
      if (!user?._id) {
        setError("User information not found. Please login again.");
        return;
      }

      const newAppointmentData = {
        title,
        description,
        type,
        tutor: tutor._id, // 👈 chỉ gửi _id
        student: user._id,
        date,
        startTime,
        endTime,
        ...(type === "online" ? { meetingLink } : { location }),
      };

      const newAppointment = await appointmentService.createAppointment(newAppointmentData);

      onSubmit(newAppointment);
      router.push("/student/appointments");
    } catch (err: any) {
      setError(err.message || "Failed to create appointment");
    }
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="bg-red-50 text-red-500 p-3 rounded-md">{error}</div>}

      <div>
        <label className="block text-sm font-medium text-gray-700">Title *</label>
        <input
          type="text"
          value={appointment.title}
          onChange={(e) => setAppointment({ ...appointment, title: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description *</label>
        <textarea
          value={appointment.description}
          onChange={(e) => setAppointment({ ...appointment, description: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          rows={3}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Type *</label>
        <select
          value={appointment.type}
          onChange={(e) =>
            setAppointment({
              ...appointment,
              type: e.target.value as AppointmentType,
              ...(e.target.value === "online"
                ? { location: undefined, meetingLink: "" }
                : { location: "startup room", meetingLink: undefined }),
            })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
        >
          <option value="online">Online</option>
          <option value="offline">Offline</option>
        </select>
      </div>

      {appointment.type === "online" ? (
        <div>
          <label className="block text-sm font-medium text-gray-700">Meeting Link *</label>
          <input
            type="text"
            value={appointment.meetingLink || ""}
            onChange={(e) => setAppointment({ ...appointment, meetingLink: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            required
          />
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-gray-700">Location *</label>
          <select
            value={appointment.location}
            onChange={(e) => setAppointment({ ...appointment, location: e.target.value as any })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            required
          >
            <option value="startup room">Startup Room</option>
            <option value="main office">Main Office</option>
            <option value="college office">College Office</option>
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Tutor *</label>
        <select
          value={appointment.tutor._id || ""}
          onChange={(e) => {
            const selected = tutors.find((t) => t._id === e.target.value);
            if (selected) setAppointment({ ...appointment, tutor: selected });
          }}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          required
        >
          <option value="">Select a tutor</option>
          {tutors.map((tutor) => (
            <option key={tutor._id} value={tutor._id}>
              {tutor.fullName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Date *</label>
        <input
          type="date"
          value={appointment.date}
          onChange={(e) => setAppointment({ ...appointment, date: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          min={new Date().toISOString().split("T")[0]}
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
        <Button text="Cancel" onClick={() => window.history.back()} />
        <Button text="Book Appointment" type="submit" primary />
      </div>
    </form>
  );
};

export default AppointmentForm;


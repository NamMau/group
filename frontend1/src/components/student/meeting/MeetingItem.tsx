import React from "react";
import { useRouter } from "next/navigation"; // Sử dụng next/navigation cho App Router

type MeetingProps = {
  chairperson: string;
  course: string;
  date: string;
  time: string;
};

const MeetingItem: React.FC<MeetingProps> = ({ chairperson, course, date, time }) => {
  const router = useRouter();

  const handleJoinMeeting = () => {
    router.push("/studentDashboard/meeting/new"); // Điều hướng đến file new.jsx
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md">
      <p className="text-sm"><strong>Chairperson:</strong> {chairperson}</p>
      <p className="text-sm"><strong>Course:</strong> {course}</p>
      <p className="text-sm"><strong>Date:</strong> {date}</p>
      <p className="text-sm"><strong>Time:</strong> {time}</p>
      <button 
        className="bg-green-500 text-white px-4 py-1 mt-2 rounded hover:bg-green-600"
        onClick={handleJoinMeeting}
      >
        ✅ Join now
      </button>
    </div>
  );
};

export default MeetingItem;

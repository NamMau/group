"use client";
import { useRouter } from "next/navigation";

const AppointmentHeader: React.FC = () => {
  const router = useRouter();

  return (
    <div className="flex justify-between items-center bg-white p-4 shadow-md">
      <h2 className="text-xl font-bold">My Appointment</h2>
      <div className="flex gap-4">
        <select className="border px-3 py-2 rounded-lg">
          <option>All</option>
          <option>Upcoming</option>
          <option>Completed</option>
        </select>
        <button className="bg-yellow-400 px-4 py-2 rounded-lg">See Appointment</button>
        {/* Nút tạo mới Appointment */}
        <button
          onClick={() => router.push("/studentDashboard/appointment/new")}
          className="bg-[#c4a484] text-white px-4 py-2 rounded-lg hover:bg-[#b38b6d] transition"
        >
          New Appointment
        </button>
      </div>
    </div>
  );
};

export default AppointmentHeader;

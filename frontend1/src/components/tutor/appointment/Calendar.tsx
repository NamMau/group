"use client";
import { useState } from "react";
import AttendanceList from "@/components/tutor/appointment/attendance/AttendanceList";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [showAttendance, setShowAttendance] = useState(false);

  return (
    <div className="bg-white shadow-md p-4 rounded-lg w-72 border border-gray-300">
      {/* Header tháng */}
      <div className="flex justify-between items-center text-brown-700 font-semibold">
        <IoChevronBack />
        <span>March</span>
        <IoChevronForward />
      </div>

      {/* Ngày trong tuần */}
      <div className="grid grid-cols-7 gap-2 mt-3 text-center text-gray-500">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
          <div key={index}>{day}</div>
        ))}
      </div>

      {/* Ngày trong tháng */}
      <div className="grid grid-cols-7 gap-2 text-center mt-2">
        {[...Array(31)].map((_, i) => (
          <button
            key={i}
            className={`p-2 text-sm rounded-md ${
              selectedDate === i + 1 ? "bg-blue-200 text-white font-semibold" : "hover:bg-gray-200"
            }`}
            onClick={() => setSelectedDate(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Nút Check Attendant */}
      <div className="mt-4">
        <button
          className="bg-[#D8C3A5] text-[#8B6F47] px-4 py-1 rounded-md text-sm font-medium shadow-sm hover:bg-[#c9b29b]"
          onClick={() => setShowAttendance(!showAttendance)}
        >
          {showAttendance ? "Hide Attendance" : "Check Attendant"}
        </button>
      </div>

      {/* Hiển thị AttendanceList khi bấm nút */}
      {showAttendance && (
        <div className="mt-4">
          <AttendanceList />
        </div>
      )}
    </div>
  );
};

export default Calendar;

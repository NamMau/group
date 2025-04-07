"use client";
import React, { useState } from "react";
import Image from "next/image";

interface AttendanceRowProps {
  index: number;
  name: string;
  avatar?: string;
}

const AttendanceRow: React.FC<AttendanceRowProps> = ({ index, name, avatar }) => {
  const [selected, setSelected] = useState<"attended" | "absent" | null>(null);

  const handleSelect = (status: "attended" | "absent") => {
    setSelected(prev => (prev === status ? null : status)); // toggle chọn / bỏ chọn
  };

  return (
    <div className="flex items-center p-4 border-b hover:bg-gray-50 transition">
      <span className="w-8 text-center text-gray-600">{index}</span>

      <div className="relative w-12 h-12">
        <Image
          src={avatar || "/default-avatar.png"}
          alt={name}
          layout="fill"
          objectFit="cover"
          className="rounded-full bg-gray-200"
        />
      </div>

      <span className="ml-4 flex-1 font-medium text-gray-800">{name}</span>

      <div className="flex items-center space-x-3">
        {/* Attended */}
        <button
          onClick={() => handleSelect("attended")}
          className={`px-3 py-1 rounded-md border transition ${
            selected === "attended"
              ? "bg-green-500 text-white border-green-600"
              : "bg-white text-green-600 border-green-400 hover:bg-green-100"
          }`}
        >
          Attended
        </button>

        {/* Absent */}
        <button
          onClick={() => handleSelect("absent")}
          className={`px-3 py-1 rounded-md border transition ${
            selected === "absent"
              ? "bg-red-500 text-white border-red-600"
              : "bg-white text-red-600 border-red-400 hover:bg-red-100"
          }`}
        >
          Absent
        </button>
      </div>
    </div>
  );
};

export default AttendanceRow;

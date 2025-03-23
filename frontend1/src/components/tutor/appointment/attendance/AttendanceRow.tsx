import React from "react";
import Image from "next/image";

interface AttendanceRowProps {
  index: number;
  name: string;
  avatar?: string;
}

const AttendanceRow: React.FC<AttendanceRowProps> = ({ index, name, avatar }) => {
  return (
    <div className="flex items-center p-4 border-b">
      <span className="w-8 text-center">{index}</span>
      <div className="relative w-12 h-12">
        <Image
          src={avatar || "/default-avatar.png"}
          alt={name}
          layout="fill"
          objectFit="cover"
          className="rounded-full bg-gray-200"
        />
      </div>
      <span className="ml-4 flex-1">{name}</span>
      
      <div className="flex items-center space-x-4">
        <label className="flex items-center space-x-1 text-green-500 cursor-pointer">
          <input type="radio" name={`attendance-${index}`} className="hidden" />
          <span className="w-4 h-4 border rounded-full inline-block"></span>
          <span>Attended</span>
        </label>
        
        <label className="flex items-center space-x-1 text-red-500 cursor-pointer">
          <input type="radio" name={`attendance-${index}`} className="hidden" />
          <span className="w-4 h-4 border rounded-full inline-block"></span>
          <span>Absent</span>
        </label>
      </div>
    </div>
  );
};

export default AttendanceRow;
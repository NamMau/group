import React from "react";
import AttendanceRow from "./AttendanceRow";

const students = [
  { id: 1, name: "Tran Van Tuong" },
  { id: 2, name: "Tran Van Tuong" },
  { id: 3, name: "Tran Van Tuong" },
  { id: 4, name: "Tran Van Tuong" },
  { id: 5, name: "Tran Van Tuong" },
];

const AttendanceList: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      {students.map((student) => (
        <AttendanceRow key={student.id} index={student.id} name={student.name} />
      ))}
    </div>
  );
};

export default AttendanceList;

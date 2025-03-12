
import { useState } from "react";
import TimeSlot from "@/components/student/appointment/TimeSlot";
import CustomDatePicker from "@/components/student/appointment/CustomDatePicker";
import Button from "@/components/student/appointment/Button";

const AppointmentForm = () => {
  const [studentName, setStudentName] = useState("");
  const [type, setType] = useState("");
  const [course, setCourse] = useState("");
  const [tutorName, setTutorName] = useState("");
  const [date, setDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");

  const handleBook = () => {
    if (!studentName || !type || !course || !tutorName || !selectedTime) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    console.log("Appointment booked:", { studentName, type, course, tutorName, date, selectedTime });
  };

  return (
    <div className="bg-white p-6 shadow rounded-lg w-full max-w-2xl">
      {/* Nhập tên sinh viên */}
      <label className="block">Name Student:</label>
      <input
        type="text"
        value={studentName}
        onChange={(e) => setStudentName(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />

      {/* Dropdown chọn Type */}
      <label className="block">Type:</label>
      <select value={type} onChange={(e) => setType(e.target.value)} className="border p-2 rounded w-full mb-4">
        <option value="">Select Type</option>
        <option value="lecture">Lecture</option>
        <option value="tutorial">Tutorial</option>
      </select>

      {/* Dropdown chọn Course */}
      <label className="block">Choose Course:</label>
      <select value={course} onChange={(e) => setCourse(e.target.value)} className="border p-2 rounded w-full mb-4">
        <option value="">Select Course</option>
        <option value="math">Mathematics</option>
        <option value="physics">Physics</option>
      </select>

      {/* Nhập tên giảng viên */}
      <label className="block">Tutor’s Name:</label>
      <input
        type="text"
        value={tutorName}
        onChange={(e) => setTutorName(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />

      {/* Chọn ngày */}
      <CustomDatePicker date={date} setDate={setDate} />

      {/* Chọn khung giờ */}
      <TimeSlot selectedTime={selectedTime} setSelectedTime={setSelectedTime} />

      {/* Nút hành động */}
      <div className="flex gap-4 mt-4">
        <Button text="Back" onClick={() => console.log("Go Back")} />
        <Button text="Book" onClick={handleBook} primary />
      </div>
    </div>
  );
};

export default AppointmentForm;

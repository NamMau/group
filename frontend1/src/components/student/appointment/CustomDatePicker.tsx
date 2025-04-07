import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface CustomDatePickerProps {
  date: Date;
  setDate: (date: Date) => void;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ date, setDate }) => {
  return (
    <div className="mb-4">
      <label className="block mb-2">Choose Date:</label>
      <div className="flex items-center gap-2">
        {/* Nút chuyển ngày trước */}
        <button
          onClick={() => setDate(new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1))}
          className="p-2 border rounded bg-gray-200 hover:bg-gray-300"
        >
          ◀
        </button>

        {/* Date Picker */}
        <DatePicker
          selected={date}
          onChange={(newDate) => newDate && setDate(newDate)}
          dateFormat="dd/MM/yyyy"
          className="border p-2 rounded text-center"
        />

        {/* Nút chuyển ngày sau */}
        <button
          onClick={() => setDate(new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1))}
          className="p-2 border rounded bg-gray-200 hover:bg-gray-300"
        >
          ▶
        </button>
      </div>
    </div>
  );
};

export default CustomDatePicker;

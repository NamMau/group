import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiChevronLeft, FiChevronRight, FiCalendar } from "react-icons/fi";

interface CustomDatePickerProps {
  date: Date;
  setDate: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  label?: string;
  disabled?: boolean;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ 
  date, 
  setDate, 
  minDate,
  maxDate,
  label = "Choose Date",
  disabled = false
}) => {
  const handlePreviousDay = () => {
    if (minDate && new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1) < minDate) return;
    setDate(new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1));
  };

  const handleNextDay = () => {
    if (maxDate && new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1) > maxDate) return;
    setDate(new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1));
  };

  const isPreviousDisabled = minDate && new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1) < minDate;
  const isNextDisabled = maxDate && new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1) > maxDate;

  return (
    <div className="mb-4">
      <label className="block mb-2 text-sm font-medium text-gray-700">{label}</label>
      <div className="flex items-center gap-2">
        <button
          onClick={handlePreviousDay}
          disabled={disabled || isPreviousDisabled}
          className={`p-2 border rounded-lg transition-colors ${
            disabled || isPreviousDisabled
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white hover:bg-gray-50 text-gray-700'
          }`}
          title="Previous day"
        >
          <FiChevronLeft className="w-5 h-5" />
        </button>

        <div className="relative flex-1">
          <DatePicker
            selected={date}
            onChange={(newDate) => newDate && setDate(newDate)}
            dateFormat="dd/MM/yyyy"
            minDate={minDate}
            maxDate={maxDate}
            disabled={disabled}
            className={`w-full pl-10 pr-4 py-2 border rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'
            }`}
            customInput={
              <div className="relative">
                <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  readOnly
                  value={date.toLocaleDateString('en-GB')}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            }
          />
        </div>

        <button
          onClick={handleNextDay}
          disabled={disabled || isNextDisabled}
          className={`p-2 border rounded-lg transition-colors ${
            disabled || isNextDisabled
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white hover:bg-gray-50 text-gray-700'
          }`}
          title="Next day"
        >
          <FiChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CustomDatePicker;

import React from "react";
import { FiClock } from "react-icons/fi";

interface TimeSlotProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  minTime?: string;
  maxTime?: string;
  disabled?: boolean;
  error?: string;
  required?: boolean;
}

const TimeSlot: React.FC<TimeSlotProps> = ({
  label,
  value,
  onChange,
  minTime,
  maxTime,
  disabled = false,
  error,
  required = false
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiClock className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="time"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={minTime}
          max={maxTime}
          disabled={disabled}
          className={`block w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
            disabled 
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
              : 'bg-white'
          } ${
            error 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:ring-orange-500'
          }`}
          required={required}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default TimeSlot;
  
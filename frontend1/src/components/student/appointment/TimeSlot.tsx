interface TimeSlotProps {
    selectedTime: string;
    setSelectedTime: (time: string) => void;
  }
  
  const TimeSlot: React.FC<TimeSlotProps> = ({ selectedTime, setSelectedTime }) => {
    const times = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM"];
  
    return (
      <div className="mb-4">
        <label className="block mb-2">Choose Time Slot:</label>
        <div className="grid grid-cols-3 gap-2">
          {times.map((time) => (
            <button
              key={time}
              className={`p-2 border rounded ${
                selectedTime === time ? "bg-orange-300 text-white" : "hover:bg-gray-200"
              }`}
              onClick={() => setSelectedTime(time)}
            >
              {time}
            </button>
          ))}
        </div>
      </div>
    );
  };
  
  export default TimeSlot;
  
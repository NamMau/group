const appointments = [
    "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM"
  ];
  
  const AppointmentList = () => {
    return (
      <div className="bg-white p-5 rounded-lg shadow-md border border-gray-300 w-full">
        {appointments.map((time, index) => (
          <div key={index} className="flex justify-between items-center py-3 px-4 border-b last:border-none">
            <span className="text-gray-700 font-medium">{time}</span>
            <button className="bg-gray-300 text-gray-800 px-4 py-1 rounded-full font-semibold hover:bg-gray-400">
              Join now
            </button>
          </div>
        ))}
      </div>
    );
  };
  
  export default AppointmentList;
  
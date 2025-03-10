const AppointmentHeader: React.FC = () => {
    return (
      <div className="flex justify-between items-center bg-white p-4 shadow-md">
        <h2 className="text-xl font-bold">My Appointment</h2>
        <div className="flex gap-4">
          <select className="border px-3 py-2 rounded-lg">
            <option>All</option>
            <option>Upcoming</option>
            <option>Completed</option>
          </select>
          <button className="bg-yellow-400 px-4 py-2 rounded-lg">See Appointment</button>
        </div>
      </div>
    );
  };
  
  export default AppointmentHeader;
  
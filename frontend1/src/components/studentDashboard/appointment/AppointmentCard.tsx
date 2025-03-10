interface AppointmentCardProps {
    course: string;
    tutor: string;
    date: string;
    status: string;
  }
  
  const AppointmentCard: React.FC<AppointmentCardProps> = ({ course, tutor, date, status }) => {
    return (
      <div className="p-4 border rounded-lg shadow-md">
        <h3 className="font-bold">{course}</h3>
        <p>Tutor: {tutor}</p>
        <p>{date}</p>
        <p className={`font-semibold ${status === "Not confirmed" ? "text-red-500" : "text-green-500"}`}>
          {status}
        </p>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-2">Change</button>
      </div>
    );
  };
  
  export default AppointmentCard;
  
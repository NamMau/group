const UpcomingMeeting = () => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold">Upcoming meeting</h3>
      <p>Class: <span className="text-red-500">abcd</span></p>
      <p>Time: <span className="text-blue-500">8:30 AM</span></p>
      <p>Date: <span className="text-green-500">17/10/2000</span></p>
      <button className="mt-3 px-4 py-2 bg-green-500 text-white rounded-md">Join now</button>
    </div>
  );
};
export default UpcomingMeeting;
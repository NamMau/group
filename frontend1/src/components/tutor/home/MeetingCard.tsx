const MeetingCard = () => {
  return (
    <div className="p-4 bg-gray-200 rounded-lg shadow-md">
      <h3 className="text-lg font-bold">Upcoming Meeting</h3>
      <p>Class: abcd</p>
      <p>Time: 8:30 AM</p>
      <p>Date: 17/10/2000</p>
      <button className="bg-gray-400 text-white py-1 px-3 mt-2 rounded-lg">Join now</button>
    </div>
  );
};

export default MeetingCard;

const MeetingCard = () => {
  return (
    <div className="bg-[#DCDAD5] p-4 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold text-[#5A3E2B]">Upcoming meeting</h3>
      <div className="mt-2 space-y-1 text-sm text-gray-700">
        <p><strong>Class:</strong> abcd</p>
        <p><strong>Time:</strong> 8:30 AM</p>
        <p><strong>Date:</strong> 17/10/2000</p>
      </div>
      <button className="bg-[#84C7AE] text-white px-4 py-2 rounded-md mt-4 hover:bg-[#6DB39B] transition-colors duration-200">
        Join now
      </button>
    </div>
  );
};
export default MeetingCard;

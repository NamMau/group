const MeetingCard = () => {
    return (
      <div className="bg-gray-100 p-4 rounded-md">
        <h3 className="text-lg font-bold">Upcoming meeting</h3>
        <p>Class: abcd</p>
        <p>Tutor: Hoang Huy</p>
        <p>Time: 8:30 AM</p>
        <p>Date: 17/10/2000</p>
        <button className="bg-green-500 text-white p-2 rounded-md mt-2">
          Join now
        </button>
      </div>
    );
  };
  export default MeetingCard;
  
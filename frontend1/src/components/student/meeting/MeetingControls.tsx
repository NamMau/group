import { FaMicrophone, FaVideo, FaDesktop, FaRecordVinyl, FaPhone } from "react-icons/fa";

const MeetingControls = () => {
  return (
    <div className="flex justify-center gap-4 p-4 bg-gray-800">
      <button className="p-2 bg-gray-600 rounded-full"><FaMicrophone /></button>
      <button className="p-2 bg-gray-600 rounded-full"><FaVideo /></button>
      <button className="p-2 bg-gray-600 rounded-full"><FaDesktop /></button>
      <button className="p-2 bg-gray-600 rounded-full"><FaRecordVinyl /></button>
      <button className="p-2 bg-red-600 rounded-full"><FaPhone /></button>
    </div>
  );
};

export default MeetingControls;

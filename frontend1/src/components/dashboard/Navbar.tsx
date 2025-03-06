import { FaSearch, FaBell, FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  return (
    <div className="flex justify-between items-center bg-white shadow-md p-4">
      {/* Logo */}
      <h1 className="text-xl font-bold text-orange-600">eTutoring</h1>

      {/* Search Bar */}
      <div className="flex items-center bg-gray-100 p-2 rounded-md w-1/3">
        <FaSearch className="text-gray-500" />
        <input
          type="text"
          placeholder="Search..."
          className="ml-2 w-full bg-transparent focus:outline-none"
        />
      </div>

      {/* Notification & User */}
      <div className="flex items-center space-x-4">
        <FaBell className="text-gray-700 text-xl cursor-pointer" />
        <FaUserCircle className="text-gray-700 text-2xl cursor-pointer" />
      </div>
    </div>
  );
};

export default Navbar;

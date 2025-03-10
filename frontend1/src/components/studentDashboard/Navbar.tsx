import { FaSearch, FaBell, FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  return (
    <div className="flex justify-between items-center bg-white shadow-md p-4">
      {/* Logo */}
      <div className="flex items-center text-orange-700 font-serif text-2xl font-bold">
        <span className="text-4xl">Oe</span>
        <span className="text-lg ml-1">tutoring</span>
      </div>

       {/* Search Bar */}
       <div className="relative w-1/3">
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-4 pr-10 py-2 bg-white border rounded-full focus:outline-none shadow-sm"
        />
        <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
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

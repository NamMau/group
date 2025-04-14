'use client';

import { FaSearch } from "react-icons/fa";
import AvatarDropdown from "@/components/tutor/dashboard/AvatarDropdown";
import NotificationDropdown from "@/components/tutor/dashboard/NotificationDropdown";
import InboxDropdown from "@/components/tutor/dashboard/InboxDropdown";

const Navbar = () => {
  return (
    <nav className="w-full flex justify-between items-center bg-white border-b px-6 py-2 fixed top-0 left-0 z-50 h-14">
      {/* Logo */}
      <div className="flex items-center text-orange-700 font-serif text-xl font-bold">
        <span className="text-3xl font-extrabold">Oe</span>
        <span className="text-lg ml-1 font-medium">tutoring</span>
      </div>

      {/* Search Bar */}
      {/* <div className="relative w-1/3">
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-4 pr-10 py-1.5 bg-white border border-orange-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm transition"
        />
        <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer hover:text-orange-600 transition duration-300" />
      </div> */}

      {/* Dropdowns: Notifications | Inbox | Avatar */}
      <div className="flex items-center space-x-5">
        <NotificationDropdown />
        <InboxDropdown />
        <AvatarDropdown />
      </div>
    </nav>
  );
};

export default Navbar;

import { useState, useRef, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import PopupMessage from "./PopupMessage"; // Import component chat popup

const notifications = [
  { id: 1, name: "Hoang Huy", message: "Ben: Where are you", time: "8 minutes ago", isOnline: true },
  { id: 2, name: "Hoang Huy", message: "Ben: Where are you", time: "8 minutes ago", isOnline: true },
  { id: 3, name: "Hoang Huy", message: "Ben: Where are you", time: "8 minutes ago", isOnline: true },
  { id: 4, name: "Hoang Huy", message: "Ben: Where are you", time: "8 minutes ago", isOnline: true },
];

const InboxDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<typeof notifications[0] | null>(null); // Fix lỗi TypeScript
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Mở popup chat khi nhấp vào tin nhắn
  const openChat = (notif: typeof notifications[0]) => {
    setSelectedChat(notif);
    setIsOpen(false); // Đóng dropdown khi mở popup chat
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Icon Notification */}
      <div className="relative cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
          {notifications.length}
        </span>
        <svg
          className="text-gray-700 text-xl hover:text-orange-600 transition duration-300"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          width="24"
          height="24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.5-1.5M9 17H4l1.5-1.5M12 9v4M12 19a1 1 0 01-1-1h2a1 1 0 01-1 1z"
          />
        </svg>
      </div>

      {/* Dropdown Content */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-lg p-4 z-50">
          {/* Header */}
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="text-lg font-semibold text-orange-700">Chat</h3>
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-4 pr-10 py-2 bg-white border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          {/* Notification List */}
          <div className="max-h-64 overflow-y-auto mt-2">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-orange-100 transition cursor-pointer"
                onClick={() => openChat(notif)} // Mở popup chat
              >
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-orange-700">{notif.name}</p>
                  <p className="text-xs text-gray-500">{notif.message}</p>
                </div>
                <p className="text-xs text-gray-400">{notif.time}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Popup Message */}
      {selectedChat && (
        <PopupMessage
          isOpen={!!selectedChat}
          onClose={() => setSelectedChat(null)}
          user={{
            name: selectedChat?.name ?? "Unknown", // Fix lỗi khi selectedChat là null
            isOnline: selectedChat?.isOnline ?? false,
          }}
        />
      )}
    </div>
  );
};

export default InboxDropdown;

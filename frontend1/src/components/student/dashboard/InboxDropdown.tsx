"use client";
import { useState, useRef, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import PopupMessage from "./PopupMessage";
import { messageService, MessageThread } from "../../../services/chatService";
import { useRouter } from "next/navigation";

const InboxDropdown = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<MessageThread | null>(null);
  const [messageThreads, setMessageThreads] = useState<MessageThread[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch message threads and unread count
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [threads, unread] = await Promise.all([
          messageService.getMessageThreads(),
          messageService.getUnreadMessages()
        ]);
        setMessageThreads(threads);
        setUnreadCount(unread);
      } catch (error) {
        console.error('Error fetching messages:', error);
        // Handle error (show toast, etc.)
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Open chat popup
  const openChat = (thread: MessageThread) => {
    setSelectedChat(thread);
    setIsOpen(false);
  };

  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  // Filter threads based on search query
  const filteredThreads = messageThreads.filter(thread =>
    thread.user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    thread.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Icon */}
      <div className="relative cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
            {unreadCount}
          </span>
        )}
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
            <h3 className="text-lg font-semibold text-orange-700">Messages</h3>
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2 bg-white border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          {/* Message Threads List */}
          <div className="max-h-64 overflow-y-auto mt-2">
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              </div>
            ) : filteredThreads.length === 0 ? (
              <div className="text-center text-gray-500 py-4">
                No messages found
              </div>
            ) : (
              filteredThreads.map((thread) => (
                <div
                  key={thread._id}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-orange-100 transition cursor-pointer"
                  onClick={() => openChat(thread)}
                >
                  <div className="relative">
                    <img
                      src={thread.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(thread.user.fullName)}&background=random`}
                      alt={thread.user.fullName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {thread.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                        {thread.unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-orange-700 truncate">
                      {thread.user.fullName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {thread.lastMessage.content}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 whitespace-nowrap">
                    {formatTime(thread.lastMessage.createdAt)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Chat Popup */}
      {selectedChat && (
        <PopupMessage
          isOpen={!!selectedChat}
          onClose={() => setSelectedChat(null)}
          user={{
            id: selectedChat.user._id,
            name: selectedChat.user.fullName,
            avatar: selectedChat.user.avatar,
            isOnline: true // This should come from a real-time status service
          }}
        />
      )}
    </div>
  );
};

export default InboxDropdown;

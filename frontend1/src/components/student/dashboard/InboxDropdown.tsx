"use client";
import { useState, useRef, useEffect } from "react";
import { FaSearch, FaEnvelope } from "react-icons/fa";
import PopupMessage from "./PopupMessage";
import { chatService, MessageThread } from "../../../services/chatService";
import { useRouter } from "next/navigation";

const InboxDropdown = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<MessageThread | null>(null);
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const data = await chatService.getMessageThreads();
        setThreads(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch messages');
      } finally {
        setLoading(false);
      }
    };

    fetchThreads();
  }, []);

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
  const filteredThreads = threads.filter(thread =>
    thread.user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-800"
      >
        <FaEnvelope className="w-6 h-6" />
        {threads.some(thread => thread.unreadCount > 0) && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
            {threads.reduce((sum, thread) => sum + thread.unreadCount, 0)}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50">
          <div className="p-4 border-b">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center">Loading messages...</div>
            ) : error ? (
              <div className="p-4 text-center text-red-500">{error}</div>
            ) : filteredThreads.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No messages found</div>
            ) : (
              filteredThreads.map((thread) => (
                <div
                  key={thread.user._id}
                  onClick={() => {
                    router.push(`/messages/${thread.user._id}`);
                    setIsOpen(false);
                  }}
                  className="p-4 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{thread.user.fullName}</h4>
                      <p className="text-sm text-gray-600 truncate">
                        {thread.lastMessage.content}
                      </p>
                    </div>
                    {thread.unreadCount > 0 && (
                      <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                        {thread.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(thread.lastMessage.createdAt).toLocaleDateString()}
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

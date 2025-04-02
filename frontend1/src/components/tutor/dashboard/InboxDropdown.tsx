import { useState, useRef, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import PopupMessage from "./PopupMessage";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Message {
  _id: string;
  sender: {
    _id: string;
    fullName: string;
    avatar?: string;
  };
  recipient: {
    _id: string;
    fullName: string;
    avatar?: string;
  };
  content: string;
  isRead: boolean;
  createdAt: string;
  relatedTo?: {
    type: 'course' | 'class' | 'meeting';
    id: string;
    name: string;
  };
}

interface ChatUser {
  _id: string;
  fullName: string;
  avatar?: string;
  isOnline: boolean;
  lastMessage?: Message;
  unreadCount: number;
}

const InboxDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<ChatUser | null>(null);
  const [chats, setChats] = useState<ChatUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Fetch unread messages count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push('/tutor/login');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/v1/messages/get-unread', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUnreadCount(response.data.data.length);
      } catch (err) {
        console.error("Error fetching unread count:", err);
      }
    };

    fetchUnreadCount();
    // Set up polling every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [router]);

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push('/tutor/login');
          return;
        }

        // Get current user ID from token or user context
        const currentUserId = localStorage.getItem("userId"); // You need to store this when user logs in
        if (!currentUserId) {
          console.error("No user ID found");
          return;
        }

        // Fetch conversations with other users
        const response = await axios.get(`http://localhost:5000/api/v1/messages/conversation/${currentUserId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Transform the response data to match our ChatUser interface
        const transformedChats = response.data.data.map((conversation: any) => ({
          _id: conversation._id,
          fullName: conversation.participant.fullName,
          avatar: conversation.participant.avatar,
          isOnline: conversation.participant.isOnline || false,
          lastMessage: conversation.messages[conversation.messages.length - 1],
          unreadCount: conversation.unreadCount || 0
        }));

        setChats(transformedChats);
      } catch (err) {
        console.error("Error fetching conversations:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch conversations");
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [router]);

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
  const openChat = (chat: ChatUser) => {
    setSelectedChat(chat);
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

  // Filter chats based on search query
  const filteredChats = chats.filter(chat => 
    chat.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="relative" ref={dropdownRef}>
        <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Icon Notification */}
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
            <h3 className="text-lg font-semibold text-orange-700">Chat</h3>
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2 bg-white border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          {/* Chat List */}
          <div className="max-h-64 overflow-y-auto mt-2">
            {filteredChats.map((chat) => (
              <div
                key={chat._id}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-orange-100 transition cursor-pointer"
                onClick={() => openChat(chat)}
              >
                <div className="relative">
                  <Image
                    src={chat.avatar || "/images/default-avatar.png"}
                    alt={chat.fullName}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  {chat.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-bold text-orange-700">{chat.fullName}</p>
                    {chat.lastMessage && (
                      <p className="text-xs text-gray-400">
                        {formatTime(chat.lastMessage.createdAt)}
                      </p>
                    )}
                  </div>
                  {chat.lastMessage && (
                    <p className="text-xs text-gray-500 truncate">
                      {chat.lastMessage.content}
                    </p>
                  )}
                  {chat.unreadCount > 0 && (
                    <span className="inline-block bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full mt-1">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
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
            id: selectedChat._id,
            name: selectedChat.fullName,
            avatar: selectedChat.avatar,
            isOnline: selectedChat.isOnline
          }}
        />
      )}
    </div>
  );
};

export default InboxDropdown;

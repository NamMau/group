import { useState, useEffect, useRef } from "react";
import { FaTimes, FaPaperclip, FaPaperPlane } from "react-icons/fa";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import io from "socket.io-client";

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
}

interface PopupMessageProps {
  isOpen: boolean;
  onClose: () => void;
  user: { 
    id: string;
    name: string; 
    avatar?: string; 
    isOnline: boolean;
  };
}

const PopupMessage = ({ isOpen, onClose, user }: PopupMessageProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [socket, setSocket] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const router = useRouter();

  // Initialize socket connection
  useEffect(() => {
    if (!isOpen) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    const newSocket = io('http://localhost:5000', {
      auth: { token }
    });

    newSocket.on('connect', () => {
      console.log('Socket connected');
    });

    newSocket.on('new_message', (message: Message) => {
      if (message.sender._id === user.id || message.recipient._id === user.id) {
        setMessages(prev => [...prev, message]);
      }
    });

    newSocket.on('typing', (data: { userId: string, isTyping: boolean }) => {
      if (data.userId === user.id) {
        setIsTyping(data.isTyping);
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [isOpen, user.id]);

  // Fetch message history
  useEffect(() => {
    const fetchMessages = async () => {
      if (!isOpen) return;

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push('/tutor/login');
          return;
        }

        const currentUserId = localStorage.getItem("userId");
        if (!currentUserId) {
          console.error("No user ID found");
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/api/v1/messages/conversation/${currentUserId}/${user.id}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        setMessages(response.data.data.messages || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch messages");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [isOpen, user.id, router]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mark messages as read
  useEffect(() => {
    const markAsRead = async () => {
      if (!isOpen || messages.length === 0) return;

      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const unreadMessages = messages.filter(msg => !msg.isRead && msg.sender._id === user.id);
        if (unreadMessages.length === 0) return;

        await axios.post(
          'http://localhost:5000/api/v1/messages/mark-read',
          {
            messageIds: unreadMessages.map(msg => msg._id)
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        // Update local messages state
        setMessages(prevMessages =>
          prevMessages.map(msg =>
            !msg.isRead && msg.sender._id === user.id
              ? { ...msg, isRead: true }
              : msg
          )
        );
      } catch (err) {
        console.error("Error marking messages as read:", err);
      }
    };

    markAsRead();
  }, [isOpen, messages, user.id]);

  // Handle typing indicator
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    
    if (!socket) return;

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Emit typing status
    socket.emit('typing', { recipientId: user.id, isTyping: true });

    // Set timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing', { recipientId: user.id, isTyping: false });
    }, 1000);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || sending) return;

    try {
      setSending(true);
      const token = localStorage.getItem("token");
      if (!token) {
        router.push('/tutor/login');
        return;
      }

      const currentUserId = localStorage.getItem("userId");
      if (!currentUserId) {
        console.error("No user ID found");
        return;
      }

      const response = await axios.post(
        'http://localhost:5000/api/v1/messages/send/send-message/:userId',
        {
          recipientId: user.id,
          content: inputText.trim()
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setMessages(prev => [...prev, response.data.data]);
      setInputText("");
      setError(null);
    } catch (err) {
      console.error("Error sending message:", err);
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-5 right-5 w-80 bg-white shadow-xl rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-300 to-orange-100">
        <div className="flex items-center space-x-3">
          <div className="relative w-10 h-10">
            <Image
              src={user.avatar || "/images/default-avatar.png"}
              alt={user.name}
              fill
              className="rounded-full object-cover"
            />
          </div>
          <div>
            <p className="text-orange-700 font-semibold">{user.name}</p>
            <p className="text-sm text-gray-500">
              {user.isOnline ? <span className="text-green-500">● Active</span> : "Offline"}
            </p>
          </div>
        </div>
        <FaTimes className="text-gray-600 cursor-pointer hover:text-red-500" onClick={onClose} />
      </div>

      {/* Messages */}
      <div className="p-3 space-y-2 h-60 overflow-y-auto bg-gray-50">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`flex ${msg.sender._id === user.id ? "justify-start" : "justify-end"}`}
            >
              <div className="flex flex-col max-w-[80%]">
                <p
                  className={`px-3 py-1 rounded-lg ${
                    msg.sender._id === user.id ? "bg-orange-200" : "bg-gray-300"
                  } text-gray-800`}
                >
                  {msg.content}
                </p>
                <span className="text-xs text-gray-400 mt-1">
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))
        )}
        {isTyping && (
          <div className="flex justify-start">
            <div className="px-3 py-1 rounded-lg bg-orange-200 text-gray-800">
              <span className="text-sm">Typing...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex items-center p-2 border-t bg-white">
        <button className="p-2 text-gray-500 hover:text-orange-500">
          <FaPaperclip />
        </button>
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 p-2 outline-none bg-gray-100 rounded-full mx-2"
          value={inputText}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          disabled={sending}
        />
        <button 
          className={`p-2 ${sending ? 'text-gray-400' : 'text-orange-500 hover:text-orange-700'}`}
          onClick={handleSendMessage}
          disabled={sending}
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default PopupMessage;

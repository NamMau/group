import { useState, useEffect, useRef } from "react";
import { FaTimes, FaPaperclip, FaPaperPlane } from "react-icons/fa";
import { messageService, Message } from "../../../services/chatService";
import Image from "next/image";

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

const PopupMessage: React.FC<PopupMessageProps> = ({ isOpen, onClose, user }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch messages when chat is opened
  useEffect(() => {
    const fetchMessages = async () => {
      if (!isOpen) return;
      
      try {
        setIsLoading(true);
        setError(null);
        const conversation = await messageService.getConversation(user.id);
        setMessages(conversation);
      } catch (err) {
        setError("Failed to load messages");
        console.error("Error fetching messages:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [isOpen, user.id]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    try {
      const newMessage = await messageService.sendMessage(user.id, inputText.trim());
      setMessages(prev => [...prev, newMessage]);
      setInputText("");
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message");
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-5 right-5 w-80 bg-white shadow-xl rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-300 to-orange-100">
        <div className="flex items-center space-x-3">
          <div className="relative w-10 h-10">
            <Image
              src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
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
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-4">{error}</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 py-4">No messages yet</div>
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
                <p className="text-xs text-gray-500 mt-1">
                  {formatTime(msg.createdAt)}
                </p>
              </div>
            </div>
          ))
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
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          disabled={isLoading}
        />
        <button 
          className="p-2 text-orange-500 hover:text-orange-700 disabled:opacity-50" 
          onClick={handleSendMessage}
          disabled={isLoading || !inputText.trim()}
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default PopupMessage;

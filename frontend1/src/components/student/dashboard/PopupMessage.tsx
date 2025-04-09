"use client";
import { useState, useEffect, useRef } from "react";
import { FaTimes, FaPaperclip, FaPaperPlane } from "react-icons/fa";
import { chatService, Message } from "../../../services/chatService";
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

const PopupMessage = ({ isOpen, onClose, user }: PopupMessageProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await chatService.getConversation(user.id);
        setMessages(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch messages');
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchMessages();
    }
  }, [isOpen, user.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const message = await chatService.sendMessage(user.id, newMessage);
      setMessages(prev => [...prev, message as Message]);
      setNewMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-xl z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Image
              src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
              alt={user.name}
              width={40}
              height={40}
              className="rounded-full"
            />
            {user.isOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
            )}
          </div>
          <div>
            <h3 className="font-semibold">{user.name}</h3>
            <p className="text-sm text-gray-500">
              {user.isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <FaTimes />
        </button>
      </div>

      {/* Messages */}
      <div className="h-96 overflow-y-auto p-4">
        {loading ? (
          <div className="text-center">Loading messages...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500">No messages yet</div>
        ) : (
          messages.map((message) => (
            <div
              key={message._id}
              className={`mb-4 ${
                message.sender._id === user.id ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`inline-block p-3 rounded-lg ${
                  message.sender._id === user.id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <p>{message.content}</p>
                <p className="text-xs mt-1 opacity-75">
                  {new Date(message.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            className="text-gray-500 hover:text-gray-700"
          >
            <FaPaperclip />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="text-blue-500 hover:text-blue-700"
          >
            <FaPaperPlane />
          </button>
        </div>
      </form>
    </div>
  );
};

export default PopupMessage;
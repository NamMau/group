"use client";
import React, { useState, useEffect, useRef } from "react";
import { FaComment, FaTimes, FaPaperPlane, FaSpinner, FaPaperclip } from "react-icons/fa";
import { useSocket } from "../../../context/SocketContext";
import axios from "axios";

interface Attachment {
  fileName: string;
  fileUrl: string;
  fileType: string;
}

interface Message {
  _id: string;
  sender: {
    _id: string;
    fullName: string;
  };
  recipient: {
    _id: string;
    fullName: string;
  };
  content: string;
  isRead: boolean;
  attachments?: Attachment[];
  relatedTo?: {
    type: 'course' | 'meeting' | 'document' | 'blog';
    id: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface FloatingChatButtonProps {
  meetingId: string;
  userId: string;
  userName: string;
  courseName?: string;
}

const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({ 
  meetingId, 
  userId, 
  userName,
  courseName 
}) => {
  const socket = useSocket();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadMessageHistory = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'http://localhost:5000/api/messages/send-message/:userId',
        {
          params: {
            relatedTo: {
              type: 'meeting',
              id: meetingId
            }
          },
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setMessages(response.data);
      scrollToBottom();
    } catch (error) {
      console.error("Error loading message history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.on('new-message', (message: Message) => {
      if (message.relatedTo?.type === 'meeting' && message.relatedTo.id === meetingId) {
        setMessages(prev => [...prev, message]);
        scrollToBottom();
      }
    });

    return () => {
      socket.off('new-message');
    };
  }, [socket, meetingId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      loadMessageHistory();
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!socket || (!newMessage.trim() && !selectedFile) || isSending) return;

    try {
      setIsSending(true);
      const token = localStorage.getItem('token');
      const formData = new FormData();

      // Add message content
      formData.append('content', newMessage.trim());
      
      // Add sender and recipient
      formData.append('sender', userId);
      formData.append('recipient', meetingId); // Assuming meetingId is the recipient for group chat
      
      // Add relatedTo information
      formData.append('relatedTo[type]', 'meeting');
      formData.append('relatedTo[id]', meetingId);

      // Add file if selected
      if (selectedFile) {
        formData.append('attachment', selectedFile);
      }

      // Send message to server
      const response = await axios.post(
        'http://localhost:5000/api/messages/send-message/:userId',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      // Emit socket event with the new message
      socket.emit('send-message', response.data);

      // Clear form
      setNewMessage("");
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const renderAttachment = (attachment: Attachment) => {
    const isImage = attachment.fileType.startsWith('image/');
    const isPDF = attachment.fileType === 'application/pdf';
    
    if (isImage) {
      return (
        <img 
          src={attachment.fileUrl} 
          alt={attachment.fileName}
          className="max-w-full rounded-lg mt-2"
        />
      );
    }
    
    return (
      <a 
        href={attachment.fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-blue-500 hover:text-blue-600 mt-2"
      >
        <FaPaperclip />
        <span>{attachment.fileName}</span>
      </a>
    );
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-lg w-80 h-96 flex flex-col">
          {/* Chat Header */}
          <div className="p-3 bg-orange-500 text-white rounded-t-lg flex justify-between items-center">
            <div>
              <h3 className="font-semibold">Meeting Chat</h3>
              {courseName && (
                <p className="text-xs opacity-90">{courseName}</p>
              )}
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-orange-600 rounded-full transition-colors"
            >
              <FaTimes />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <FaSpinner className="animate-spin text-orange-500 text-2xl" />
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center text-gray-500 text-sm py-4">
                No messages yet. Start the conversation!
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message._id}
                  className={`flex flex-col ${
                    message.sender._id === userId ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-2 ${
                      message.sender._id === userId
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-xs font-semibold opacity-90">{message.sender.fullName}</p>
                    <p className="text-sm mt-1">{message.content}</p>
                    {message.attachments?.map((attachment, index) => (
                      <div key={index}>
                        {renderAttachment(attachment)}
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 mt-1">
                    {new Date(message.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="p-3 border-t">
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-500 hover:text-orange-500 transition-colors"
                disabled={isSending}
              >
                <FaPaperclip />
              </button>
              <input
                ref={inputRef}
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                disabled={isSending}
              />
              <button
                type="submit"
                disabled={isSending || (!newMessage.trim() && !selectedFile)}
                className={`bg-orange-500 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2
                  ${isSending || (!newMessage.trim() && !selectedFile)
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-orange-600'}`}
              >
                {isSending ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaPaperPlane />
                )}
                <span>Send</span>
              </button>
            </div>
            {selectedFile && (
              <p className="text-xs text-gray-500 mt-1">
                Selected file: {selectedFile.name}
              </p>
            )}
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="p-3 bg-orange-500 rounded-full hover:bg-orange-600 transition-colors shadow-lg"
          title="Open chat"
        >
          <FaComment className="text-white" />
        </button>
      )}
    </div>
  );
};

export default FloatingChatButton;

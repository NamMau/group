'use client';

import { useEffect, useRef, useState } from 'react';
import { chatService } from '@/services/chatService';
import type { Message } from '@/services/chatService';
import { authService } from '@/services/authService';
import { BellIcon, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';

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

export const PopupMessage = ({ isOpen, onClose, user }: PopupMessageProps) => {
  const [unreadMessages, setUnreadMessages] = useState<Message[]>([]);
  const [openMessageId, setOpenMessageId] = useState<string | null>(null);
  const [conversation, setConversation] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [openList, setOpenList] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const msgs = await chatService.getUnreadMessages();
      setUnreadMessages(msgs);
    };
    fetchMessages();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenList(false);
        setOpenMessageId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const openConversation = async (message: Message) => {
    setOpenMessageId(message._id);
    const conv = await chatService.getConversation(message.sender._id);
    setConversation(conv);
  };

  const handleSendMessage = async (e: React.FormEvent, receiverId: string) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const message = await chatService.sendMessage(receiverId, newMessage);
    setConversation((prev) => [...prev, message as Message]);
    setNewMessage('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  if (!authService.isAuthenticated()) return null;

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setOpenList(!openList)}
        className="relative p-2 rounded-full hover:bg-gray-100"
      >
        <BellIcon className="w-6 h-6" />
        {unreadMessages.length > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs text-white bg-red-500 rounded-full">
            {unreadMessages.length}
          </span>
        )}
      </button>

      {/* Danh sách tin nhắn chưa đọc */}
      {openList && (
        <div className="absolute right-0 z-50 mt-2 w-72 bg-white border border-gray-200 rounded-md shadow-lg">
          {unreadMessages.length === 0 ? (
            <div className="p-4 text-sm text-gray-500">Không có tin nhắn mới</div>
          ) : (
            unreadMessages.map((msg) => (
              <div
                key={msg._id}
                onClick={() => openConversation(msg)}
                className="p-3 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
              >
                <div className="font-semibold">{msg.sender.fullName}</div>
                <div className="text-sm text-gray-600">{msg.content}</div>
                <div className="text-xs text-gray-400">
                  {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Popup tin nhắn */}
      {openMessageId && (
        <div className="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-xl z-50">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-3">
              <Image
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  conversation[0]?.sender.fullName || 'Người dùng'
                )}`}
                alt={conversation[0]?.sender.fullName || 'Avatar'}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <h3 className="font-semibold">{conversation[0]?.sender.fullName}</h3>
                <p className="text-sm text-gray-500">{conversation[0]?.sender.email}</p>
              </div>
            </div>
            <button onClick={() => setOpenMessageId(null)} className="text-gray-500 hover:text-gray-700">
              <X />
            </button>
          </div>

          <div className="h-96 overflow-y-auto p-4">
            {conversation.map((msg) => (
              <div
                key={msg._id}
                className={`mb-4 ${
                  msg.sender._id === conversation[0]?.sender._id ? 'text-left' : 'text-right'
                }`}
              >
                <div
                  className={`inline-block p-3 rounded-lg ${
                    msg.sender._id === conversation[0]?.sender._id
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-blue-500 text-white'
                  }`}
                >
                  <p>{msg.content}</p>
                  <p className="text-xs mt-1 opacity-75">
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={(e) => handleSendMessage(e, conversation[0]?.sender._id)}
            className="p-4 border-t"
          >
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Nhập tin nhắn..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="submit" className="text-blue-500 hover:text-blue-700">
                Gửi
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

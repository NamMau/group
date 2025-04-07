import { useState } from "react";
import { FaTimes, FaPaperclip, FaPaperPlane } from "react-icons/fa";

interface PopupMessageProps {
  isOpen: boolean;
  onClose: () => void;
  user: { name: string; avatar?: string; isOnline: boolean };
}

const PopupMessage = ({ isOpen, onClose, user }: PopupMessageProps) => {
  const [messages, setMessages] = useState([
    { sender: "user", text: "Hello" },
    { sender: "me", text: "Hello" },
  ]);
  const [inputText, setInputText] = useState("");

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    setMessages([...messages, { sender: "me", text: inputText }]);
    setInputText("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-5 right-5 w-80 bg-white shadow-xl rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-300 to-orange-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full">
            {user.avatar ? <img src={user.avatar} alt={user.name} className="rounded-full" /> : null}
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
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
            <p
              className={`px-3 py-1 rounded-lg ${
                msg.sender === "me" ? "bg-gray-300" : "bg-orange-200"
              } text-gray-800`}
            >
              {msg.text}
            </p>
          </div>
        ))}
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
        />
        <button className="p-2 text-orange-500 hover:text-orange-700" onClick={handleSendMessage}>
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default PopupMessage;

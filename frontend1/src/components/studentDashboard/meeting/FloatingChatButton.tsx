import { FaComment } from "react-icons/fa";

const FloatingChatButton = () => {
  return (
    <button className="fixed bottom-4 right-4 p-3 bg-gray-700 rounded-full">
      <FaComment />
    </button>
  );
};

export default FloatingChatButton;

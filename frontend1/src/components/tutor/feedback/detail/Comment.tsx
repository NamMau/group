import React from "react";

interface CommentProps {
  text: string;
  date: string;
}

const Comment: React.FC<CommentProps> = ({ text, date }) => {
  return (
    <div className="p-3 bg-white shadow-sm rounded-lg my-2">
      <p className="text-gray-700">{text}</p>
      <p className="text-xs text-gray-500">{date}</p>
    </div>
  );
};

export default Comment;

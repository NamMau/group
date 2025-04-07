import { JSX } from "react";
import { FaHtml5, FaCss3Alt, FaJs, FaPython, FaBootstrap, FaReact } from "react-icons/fa";

interface CourseCardProps {
  title: string;
  icon: string;
}

const iconMap: { [key: string]: JSX.Element } = {
  html5: <FaHtml5 className="text-orange-500 text-4xl" />,
  css3: <FaCss3Alt className="text-blue-500 text-4xl" />,
  js: <FaJs className="text-yellow-500 text-4xl" />,
  python: <FaPython className="text-green-500 text-4xl" />,
  bootstrap: <FaBootstrap className="text-purple-500 text-4xl" />,
  react: <FaReact className="text-blue-400 text-4xl" />,
};

const CourseCard: React.FC<CourseCardProps> = ({ title, icon }) => {
  return (
    <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-4 rounded-lg shadow-md text-center transform transition-transform duration-300 hover:scale-105">
      <div className="mb-2">{iconMap[icon]}</div>
      <h3 className="font-bold text-gray-800">{title}</h3>
      <button className="mt-3 px-4 py-1 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition">
        View
      </button>
    </div>
  );
};

export default CourseCard;

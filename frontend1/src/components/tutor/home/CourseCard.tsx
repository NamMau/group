import { FaHtml5, FaCss3Alt, FaJs, FaPython, FaBootstrap, FaReact } from "react-icons/fa";

// Định nghĩa kiểu dữ liệu cho props
interface CourseCardProps {
  title: string;
  icon: keyof typeof iconMap;
  onViewCourse: () => void;
}

const iconMap = {
  html5: <FaHtml5 className="text-orange-500 text-4xl" />,
  css3: <FaCss3Alt className="text-blue-500 text-4xl" />,
  js: <FaJs className="text-yellow-500 text-4xl" />,
  python: <FaPython className="text-green-500 text-4xl" />,
  bootstrap: <FaBootstrap className="text-purple-500 text-4xl" />,
  react: <FaReact className="text-blue-400 text-4xl" />,
};

// Thêm kiểu dữ liệu cho props
const CourseCard: React.FC<CourseCardProps> = ({ title, icon, onViewCourse }) => {
  return (
    <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-4 rounded-lg shadow-md text-center transform transition-transform duration-300 hover:scale-105">
      <div className="mb-2">{iconMap[icon]}</div>
      <h3 className="font-bold text-gray-800">{title}</h3>
      <button
        onClick={onViewCourse} // Khi nhấp, gọi hàm để hiển thị StudentTable
        className="mt-3 px-4 py-1 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition"
      >
        View
      </button>
    </div>
  );
};

export default CourseCard;

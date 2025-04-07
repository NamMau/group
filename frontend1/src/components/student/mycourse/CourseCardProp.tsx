interface CourseCardProps {
  title: string;
  category: string;
  views: string;
  duration: string;
  isNew?: boolean;
  onClick: () => void; // Nhận hàm xử lý khi nhấn vào khóa học
}

const CourseCard: React.FC<CourseCardProps> = ({ title, category, views, duration, isNew, onClick }) => {
  return (
    <div className="bg-[#F6E7D8] p-4 rounded-lg shadow-md relative text-center w-full">
      {isNew && <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">New</span>}

      <div className="w-full h-32 bg-gray-300 rounded-lg mb-3"></div>

      <h3 className="font-bold text-md text-brown-700 mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{category}</p>
      <p className="text-xs text-gray-500 mt-1">👁️ {views} | ⏳ {duration}</p>

      <button 
        onClick={onClick} // Gọi hàm điều hướng khi bấm vào nút
        className="mt-3 px-4 py-1 bg-[#C1915F] text-white rounded-md hover:bg-[#A6784D] transition"
      >
        View Course
      </button>
    </div>
  );
};

export default CourseCard;

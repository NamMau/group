interface CourseCardProps {
    title: string;
    category: string;
    views: string;
    duration: string;
    isNew?: boolean;
  }
  
  const CourseCard: React.FC<CourseCardProps> = ({ title, category, views, duration, isNew }) => {
    return (
      <div className="bg-[#F6E7D8] p-4 rounded-lg shadow-md relative text-center w-full">
        {/* Badge "New" */}
        {isNew && <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">New</span>}
  
        {/* Hình ảnh khóa học */}
        <div className="w-full h-32 bg-gray-300 rounded-lg mb-3"></div>
  
        {/* Nội dung khóa học */}
        <h3 className="font-bold text-md text-brown-700 mb-1">{title}</h3>
        <p className="text-sm text-gray-600">{category}</p>
        <p className="text-xs text-gray-500 mt-1">👁️ {views} | ⏳ {duration}</p>
  
        {/* Nút xem khóa học */}
        <button className="mt-3 px-4 py-1 bg-[#C1915F] text-white rounded-md hover:bg-[#A6784D] transition">
          View Course
        </button>
      </div>
    );
  };
  
  export default CourseCard;
  
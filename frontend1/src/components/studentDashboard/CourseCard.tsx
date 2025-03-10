interface CourseCardProps {
    title: string;
    icon: string;
  }
  
  const CourseCard: React.FC<CourseCardProps> = ({ title, icon }) => {
    return (
      <div className="bg-gradient-to-r from-orange-100 to-orange-200 p-4 rounded-lg shadow-md text-center">
        <div className="text-4xl mb-2">{icon}</div>
        <h3 className="font-bold">{title}</h3>
        <button className="mt-3 px-4 py-1 bg-orange-500 text-white rounded-md">
          View
        </button>
      </div>
    );
  };
  
  export default CourseCard;
  

interface CourseCardProps {
    title: string;
    category: string;
    views: string;
    duration: string;
    isNew?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({ title, category, views, duration, isNew }) => {
    return (
        <div className="bg-gradient-to-r from-orange-100 to-orange-200 p-4 rounded-lg shadow-md text-center relative">
            {isNew && <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">New</span>}
            <h3 className="font-bold text-lg mb-1">{title}</h3>
            <p className="text-sm text-gray-600">{category}</p>
            <p className="text-xs text-gray-500">👁️ {views} | ⏳ {duration}</p>
            <button className="mt-3 px-4 py-1 bg-orange-500 text-white rounded-md">View</button>
        </div>
    );
};

export default CourseCard;

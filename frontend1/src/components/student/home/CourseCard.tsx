import Image from "next/image";

interface CourseCardProps {
  title: string;
}

const CourseCard: React.FC<CourseCardProps> = ({ title }) => {
  return (
    <div className="bg-gradient-to-r from-gray-300 to-gray-200 p-4 rounded-md flex flex-col items-center">
      {/* Sử dụng next/image */}
      <Image
        src="/html5.png"
        alt="HTML5"
        width={64} // tương ứng w-16
        height={64} // tương ứng h-16
        className="mb-2"
      />
      <h2 className="text-lg font-bold">{title}</h2>
      <button className="text-blue-500 mt-2">View &gt;</button>
    </div>
  );
};

export default CourseCard;

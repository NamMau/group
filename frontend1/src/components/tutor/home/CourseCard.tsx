import Image from "next/image";

interface CourseCardProps {
  title: string;
}

const CourseCard: React.FC<CourseCardProps> = ({ title }) => {
  return (
    <div className="bg-[#E8DED1] p-4 rounded-lg shadow-md flex flex-col items-center">
      <Image
        src={`/icons/html5.svg`}
        alt={title}
        width={64} // 16 * 4 = 64px
        height={64}
        className="mb-4"
      />
      <h3 className="text-lg font-semibold">{title}</h3>
      <a href="#" className="text-blue-600 mt-2">View →</a>
    </div>
  );
};

export default CourseCard;

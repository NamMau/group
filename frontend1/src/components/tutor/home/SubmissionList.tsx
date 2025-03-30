import Image from "next/image";

const SubmissionList = () => {
  return (
    <div className="p-6 rounded-lg shadow-md bg-white">
      <h2 className="text-lg font-semibold mb-4">Most recent submission</h2>
      <ul className="space-y-2">
        {Array(3)
          .fill(0)
          .map((_, index) => (
            <li key={index} className="flex justify-between text-sm border-b pb-2">
              <div className="flex items-center gap-2">
                <Image
                  src="/icons/user.svg"
                  alt="User"
                  width={20} // Kích thước cố định
                  height={20}
                  className="rounded-full"
                />
                <span>Kristin Watson</span>
              </div>
              <span>5 minutes ago</span>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default SubmissionList;

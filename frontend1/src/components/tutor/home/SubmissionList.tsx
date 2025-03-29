const SubmissionList = () => {
  const submissions = [
    { name: "Kristin Watson", className: "Class name", time: "5 minutes ago" },
    { name: "Kristin Watson", className: "Class name", time: "5 minutes ago" },
    { name: "Kristin Watson", className: "Class name", time: "5 minutes ago" }
  ];

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-bold">Most recent submission</h3>
      <ul>
        {submissions.map((item, index) => (
          <li key={index} className="flex justify-between items-center border-b py-2">
            <div className="flex items-center gap-2">
              <img src="/avatar.png" alt="User" className="w-6 h-6 rounded-full" />
              <span>{item.name}</span>
            </div>
            <span>{item.className}</span>
            <span className="text-gray-500">{item.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubmissionList;

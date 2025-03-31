const RecentSubmissions = () => {
  const submissions = Array(6).fill({ name: "Kristin Watson", className: "Class name", time: "5 minutes ago" });

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold">Most recent submission</h3>
      <ul className="mt-2 space-y-2">
        {submissions.map((sub, index) => (
          <li key={index} className="flex items-center gap-2">
            <img src="/avatar.png" alt="avatar" className="w-6 h-6 rounded-full" />
            <span>{sub.name}</span>
            <span className="text-gray-500">{sub.className}</span>
            <span className="text-gray-400">{sub.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default RecentSubmissions;
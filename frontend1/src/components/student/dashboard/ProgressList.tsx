const topics = [
  { name: "HTML", progress: 80, icon: "📄" },
  { name: "CSS", progress: 70, icon: "🎨" },
  { name: "JavaScript", progress: 60, icon: "⚡" },
  { name: "Python", progress: 50, icon: "🐍" },
  { name: "Bootstrap", progress: 90, icon: "📦" },
  { name: "React", progress: 40, icon: "⚛️" },
];

const ProgressList = () => {
  return (
    <div className="space-y-4">
      {topics.map((topic) => (
        <div key={topic.name} className="flex items-center space-x-3">
          <span className="text-lg">{topic.icon}</span>
          <div className="w-full">
            <span className="font-medium text-gray-700">{topic.name}</span>
            <div className="w-full bg-gray-200 rounded-md mt-1 h-3">
              <div
                className="h-3 rounded-md transition-all duration-500"
                style={{
                  width: `${topic.progress}%`,
                  background: `linear-gradient(to right, #FFAA5B, #FF6B35)`,
                }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProgressList;

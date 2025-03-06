const topics = [
    { name: "HTML", progress: 80 },
    { name: "CSS", progress: 70 },
    { name: "JavaScript", progress: 60 },
    { name: "Python", progress: 50 },
    { name: "Bootstrap", progress: 90 },
    { name: "React", progress: 40 },
  ];
  
  const ProgressList = () => {
    return (
      <div>
        {topics.map((topic) => (
          <div key={topic.name} className="mb-3">
            <span className="font-medium">{topic.name}</span>
            <div className="w-full bg-gray-200 rounded-md mt-1">
              <div
                className="h-3 bg-orange-500 rounded-md"
                style={{ width: `${topic.progress}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  export default ProgressList;
  
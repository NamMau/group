const CourseInfo = () => {
    const infoItems = [
      { icon: "📌", text: "Basic Level" },
      { icon: "⏳", text: "Duration 10 Hours 29 Minutes" },
      { icon: "📚", text: "Total 18 Lessons" },
      { icon: "🌍", text: "Learn Anytime, Anywhere" },
    ];
  
    return (
      <ul className="mt-6 space-y-3">
        {infoItems.map((item, index) => (
          <li key={index} className="flex items-center gap-3 text-gray-700 text-lg">
            <span className="text-[#6D4C41] text-xl">{item.icon}</span>
            <span>{item.text}</span>
          </li>
        ))}
      </ul>
    );
  };
  
  export default CourseInfo;
  
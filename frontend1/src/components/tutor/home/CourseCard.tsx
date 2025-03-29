const CourseCard = ({ title }) => {
    return (
      <div className="bg-gradient-to-br from-[#D4A373] to-[#EDE4DA] p-4 rounded-lg shadow-md w-60">
        <img src="/html5-icon.png" alt="HTML5" className="w-16 h-16" />
        <h3 className="font-bold text-lg">{title}</h3>
        <a href="#" className="text-blue-600">View &gt;</a>
      </div>
    );
  };
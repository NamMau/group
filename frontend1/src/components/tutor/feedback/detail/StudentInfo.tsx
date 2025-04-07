import Comment from "./Comment"; 

const StudentInfo = () => {
  return (
    <div className="w-80 bg-gray-100 p-5 rounded-lg">
      <h3 className="text-xl font-semibold">Name Student</h3>
      <div className="mt-3">
        <p className="text-gray-600">Name Document:</p>
        <p className="font-semibold underline">Information Technology</p>
      </div>
      <div className="mt-3">
        <p className="text-gray-600">Date of submission:</p>
        <p className="font-semibold">01/03/2025</p>
      </div>
      <div className="mt-5">
        <h4 className="text-lg font-semibold">Comments</h4>
        <Comment text="Tài liệu có đầy đủ nội dung yêu cầu." date="12/03/2025 14:00" />
        <Comment text="Bổ sung thêm một số ví dụ thực tế." date="12/03/2025 14:10" />
      </div>
      <div className="mt-3">
        <input type="text" placeholder="Send a comment" className="w-full p-2 border rounded-lg" />
      </div>
    </div>
  );
};

export default StudentInfo;

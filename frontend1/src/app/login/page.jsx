"use client";
import { useState } from 'react';

const LoginPage = () => {
  const [campus, setCampus] = useState('');

  const handleLogin = (role) => {
    if (!campus) {
      alert('Vui lòng chọn campus trước khi đăng nhập');
      return;
    }
    console.log(`Đăng nhập với vai trò: ${role} tại campus: ${campus}`);
    // Thực hiện chuyển hướng hoặc gọi API xử lý đăng nhập
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="w-1/2">
          <img
            src="/background.jpg"
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="w-1/2 p-10 flex flex-col justify-center bg-[#f8f9fa]">
          <h1 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
            Sign in for Tutor and Student
          </h1>

          <div className="mb-6">
            <label htmlFor="campus" className="block mb-2 text-lg font-medium">
              Select Campus
            </label>
            <select
              id="campus"
              value={campus}
              onChange={(e) => setCampus(e.target.value)}
              className="p-3 border rounded w-full"
            >
              <option value="">-- Select Campus --</option>
              <option value="campus1">Campus 1</option>
              <option value="campus2">Campus 2</option>
              <option value="campus3">Campus 3</option>
            </select>
          </div>

          <button
            onClick={() => handleLogin('student')}
            className="w-full px-6 py-3 mb-4 bg-[#c0c0b5] text-gray-800 rounded hover:bg-[#b0b0a5]"
          >
            Sign in with Email Student
          </button>

          <button
            onClick={() => handleLogin('teacher')}
            className="w-full px-6 py-3 bg-[#c0c0b5] text-gray-800 rounded hover:bg-[#b0b0a5]"
          >
            Sign in with Tutor Account
          </button>

          <p className="text-center mt-10 text-gray-600">
            © Powered by Hoang Huy
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

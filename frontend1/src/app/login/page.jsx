"use client";
import { useState } from "react";
import Image from "next/image";
import CampusSelect from "@/components/login/CampusSelect";
import LoginButton from "@/components//login/LoginButton";

const LoginPage = () => {
  const [campus, setCampus] = useState("");

  const handleLogin = (role) => {
    if (!campus) {
      alert("Vui lòng chọn campus trước khi đăng nhập");
      return;
    }
    console.log(`Đăng nhập với vai trò: ${role} tại campus: ${campus}`);
    // Thực hiện chuyển hướng hoặc gọi API xử lý đăng nhập
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Hình ảnh bên trái */}
        <div className="w-1/2">
          <Image
            src="/background.jpg"
            alt="Background"
            width={500}
            height={500}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Form đăng nhập bên phải */}
        <div className="w-1/2 p-10 flex flex-col justify-center bg-[#f8f9fa]">
          <h1 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
            Sign in for Tutor and Student
          </h1>

          {/* Component chọn campus */}
          <CampusSelect value={campus} onChange={setCampus} />

          {/* Component nút đăng nhập */}
          <LoginButton text="Sign in with Email Student" onClick={() => handleLogin("student")} />
          <LoginButton text="Sign in with Tutor Account" onClick={() => handleLogin("teacher")} />

          <p className="text-center mt-10 text-gray-600">© Powered by Hoang Huy</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

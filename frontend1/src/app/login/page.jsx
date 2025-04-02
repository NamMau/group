"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import LoginButton from "@/components/login/LoginButton";

const LoginPage = () => {
  const router = useRouter();

  const handleLogin = (path) => {
    router.push(path);
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
            Sign in for Admin, Tutor, and Student
          </h1>

          {/* Nút đăng nhập */}
          <LoginButton text="Sign in with Admin Email" onClick={() => handleLogin("/admin/login")} />
          <LoginButton text="Sign in with Student Email" onClick={() => handleLogin("/student/login")} />
          <LoginButton text="Sign in with Tutor Account" onClick={() => handleLogin("/tutor/login")} />

          <p className="text-center mt-10 text-gray-600">© Powered by Hoang Huy</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

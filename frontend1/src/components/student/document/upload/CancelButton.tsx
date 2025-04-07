"use client";
import { useRouter } from "next/navigation";

const CancelButton = () => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/student/document/submit")}
      className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
    >
      Cancel
    </button>
  );
};

export default CancelButton;

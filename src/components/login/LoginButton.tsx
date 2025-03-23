interface LoginButtonProps {
    text: string;
    onClick: () => void;
  }
  
  const LoginButton = ({ text, onClick }: LoginButtonProps) => {
    return (
      <button
        onClick={onClick}
        className="w-full px-6 py-3 mb-4 bg-[#c0c0b5] text-gray-800 rounded hover:bg-[#b0b0a5] transition"
      >
        {text}
      </button>
    );
  };
  
  export default LoginButton;
  
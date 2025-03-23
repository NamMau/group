interface ButtonProps {
    text: string;
    onClick?: () => void;
    primary?: boolean;
  }
  
  const Button: React.FC<ButtonProps> = ({ text, onClick, primary }) => {
    return (
      <button
        onClick={onClick}
        className={`px-4 py-2 rounded ${
          primary ? "bg-orange-500 text-white" : "bg-gray-300"
        }`}
      >
        {text}
      </button>
    );
  };
  
  export default Button;
  
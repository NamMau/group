interface ButtonProps {
  text: string;
  onClick?: () => void;
  primary?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const Button = ({
  text,
  onClick,
  primary = false,
  disabled = false,
  type = "button", 
}: ButtonProps) => {
  const baseStyles = "px-4 py-2 rounded-md transition-colors";
  const primaryStyles = primary
    ? "bg-orange-500 text-white hover:bg-orange-600"
    : "bg-gray-200 text-gray-700 hover:bg-gray-300";
  const disabledStyles = disabled
    ? "opacity-50 cursor-not-allowed"
    : "cursor-pointer";

  return (
    <button
      type={type} 
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${primaryStyles} ${disabledStyles}`}
    >
      {text}
    </button>
  );
};

export default Button;

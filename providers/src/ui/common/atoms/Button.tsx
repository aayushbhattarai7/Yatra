import { ReactNode } from "react";

interface ButtonProps {
  name?: string;
  type?: "submit" | "reset" | "button";
  disabled?: boolean;
  buttonText: string;
  className?: string;
  onClick?: () => void;
  icon?: ReactNode; 
  iconPosition?: "left" | "right"; 
}

const Button: React.FC<ButtonProps> = ({
  name,
  type = "button",
  disabled = false,
  buttonText,
  className = "",
  onClick,
  icon,
  iconPosition = "left",
}) => {
  return (
    <button
      type={type}
      name={name}
      disabled={disabled}
      className={`w-32 mb-4 bg-blue-600 text-white hover:bg-blue-700 p-3 rounded-xl font-poppins shadow-xl flex items-center justify-center gap-2 ${className} ${
        disabled && "opacity-50 cursor-not-allowed"
      }`}
      onClick={onClick}
    >
      {icon && iconPosition === "left" && <span>{icon}</span>}
      <span>{buttonText}</span>
      {icon && iconPosition === "right" && <span>{icon}</span>}
    </button>
  );
};

export default Button;

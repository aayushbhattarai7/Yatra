import { image } from "../../../config/constant/image";
interface ButtonProps {
  name?: string;
  type: "submit" | "reset" | "button";
  disabled?: boolean;
  buttonText: string;
  className?: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  name,
  type = undefined,
  disabled = false,
  buttonText,
  className,
  onClick,
}) => {
  return (
    <div>
      <button
        type={type}
        name={name}
        disabled={disabled}
        className={` w-32 mb-4 bg-[#1366D9] text-white hover:bg-blue-700 p-3 rounded-xl font-poppins shadow-xl ${className}`}
        onClick={onClick}
      >
        {disabled ? <image /> : buttonText}
      </button>
    </div>
  );
};

export default Button;

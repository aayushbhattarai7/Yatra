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
        className={`max-w-full mb-4 bg-blue-500 text-white hover:bg-blue-700 p-3 rounded-xl ${className}`}
        onClick={onClick}
      >
        {disabled ? <img src={image?.loader} /> : buttonText}
      </button>
    </div>
  );
};

export default Button;

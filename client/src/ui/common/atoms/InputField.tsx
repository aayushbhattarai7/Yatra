import { useState } from "react";
import { FieldError, UseFormRegister } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface InputFieldProps {
  placeholder?: string;
  type?: string;
  name: string;
  readOnly?: boolean;
  error?: FieldError;
  register: UseFormRegister<any>;
  multiple?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  className: string;
  required?: boolean;
  maxLength?: number;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  accept?: string;
  value?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  placeholder,
  type = "text",
  name,
  readOnly,
  error,
  register,
  multiple,
  onChange,
  className,
  required,
  accept,
  value,
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const toggleField = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="flex relative">
      <input
        type={type === "password" ? (showPassword ? "text" : "password") : type}
        readOnly={readOnly}
        placeholder={placeholder}
        value={value}
        multiple={multiple}
        accept=""
        {...register(name, { required })}
        onChange={onChange}
        className={`rounded-lg p-2 border border-black outline-none ${className}`}
      />
      {type === "password" && (
        <span
          className="absolute right-2 top-1/3 transform-translate-y-1/2 cursor-pointer "
          onClick={toggleField}
        >
          {" "}
          {showPassword ? <FaEye /> : <FaEyeSlash />}
        </span>
      )}
      {error && <p className="text-red-500 text-xs">{error.message}</p>}
    </div>
  );
};

export default InputField;

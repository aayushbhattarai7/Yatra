import { useState, useEffect } from "react";
import { FieldError, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface InputFieldProps {
  placeholder?: string;
  type?: string;
  name: string;
  readOnly?: boolean;
  error?: FieldError;
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  multiple?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  className: string;
  required?: boolean;
  maxLength?: number;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  accept?: string;
  value?: string;
  icon?: React.ReactNode;
}

const InputField: React.FC<InputFieldProps> = ({
  placeholder,
  type = "text",
  name,
  readOnly,
  error,
  register,
  setValue,
  multiple,
  onChange,
  className,
  required,
  accept,
  value,
  icon,
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const toggleField = () => {
    setShowPassword((prev) => !prev);
  };

  useEffect(() => {
    const input = document.querySelector<HTMLInputElement>(
      `input[name="${name}"]`,
    );
    if (input && input.value) {
      setValue(name, input.value, { shouldValidate: true });
    }
  }, [name, setValue]);

  return (
    <div className="flex relative items-center">
      {icon && (
        <span className="absolute left-3 text-black text-xl">{icon}</span>
      )}
      <input
        type={type === "password" ? (showPassword ? "text" : "password") : type}
        readOnly={readOnly}
        placeholder={placeholder}
        multiple={multiple}
        accept={accept}
        {...register(name, { required })}
        onChange={onChange}
        className={`w-[364px] h-[52px] rounded-lg p-5 pl-${
          icon ? "10" : "5"
        } border border-black bg-[#F0EDFF] outline-none placeholder-black ${className}`}
      />
      {type === "password" && (
        <span
          className="absolute right-5 top-1/3 transform-translate-y-1/2 cursor-pointer"
          onClick={toggleField}
        >
          {showPassword ? <FaEye /> : <FaEyeSlash />}
        </span>
      )}
      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  );
};

export default InputField;

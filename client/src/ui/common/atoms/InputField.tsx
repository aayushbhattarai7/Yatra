import { useState, useEffect } from "react";
import { FieldError, RegisterOptions, UseFormRegister, UseFormSetValue, useWatch, Control } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface InputFieldProps {
  placeholder?: string;
  type?: string;
  name: string;
  readOnly?: boolean;
  error?: FieldError;
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  control: Control<any>;
  multiple?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  className: string;
  required?: boolean;
  maxLength?: number;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  accept?: string;
  value?: string;
  icon?: React.ReactNode;
  rules?: RegisterOptions;
}

const InputField: React.FC<InputFieldProps> = ({
  placeholder,
  type = "text",
  name,
  readOnly,
  error,
  register,
  setValue,
  control,
  multiple,
  onChange,
  className,
  rules,
  accept,
  icon,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const value = useWatch({ name, control });

  useEffect(() => {
    if (value) {
      setValue(name, value, { shouldValidate: true });
    }
  }, [value, name, setValue]);

  return (
    <div className="flex flex-col relative items-start">
      {icon && <span className="absolute left-3 top-3 text-black text-xl">{icon}</span>}

      <input
        type={type === "password" ? (showPassword ? "text" : "password") : type}
        readOnly={readOnly}
        placeholder={placeholder}
        multiple={multiple}
        accept={accept}
        autoComplete={type === "password" ? "current-password" : "on"}
        {...register(name, rules)}
        onChange={onChange}
        className={`w-[364px] h-[52px] rounded-lg p-5 pl-${icon ? "10" : "5"} border border-black bg-[#F0EDFF] outline-none placeholder-black ${className}`}
      />

      {type === "password" && (
        <span
          className="absolute right-5 top-1/3 transform-translate-y-1/2 cursor-pointer"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? <FaEye /> : <FaEyeSlash />}
        </span>
      )}

      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  );
};

export default InputField;

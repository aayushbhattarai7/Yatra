import { SubmitHandler, useForm } from "react-hook-form";
import { Mail, Lock } from "lucide-react";
import Label from "../atoms/Label";
import InputField from "../atoms/InputField";
import Button from "../atoms/Button";
import { authLabel } from "../../../localization/auth";
import { useLang } from "../../../hooks/useLang";

interface FormData {
  email: string;
  password: string;
}

interface LoginFormProps {
  onSubmit: SubmitHandler<FormData>;
  isSubmitting: boolean;
}

const LoginForm = ({ onSubmit, isSubmitting }: LoginFormProps) => {
  const { lang } = useLang();
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
      <div className="space-y-4">
        <div>
          <Label name="email" label={authLabel.email[lang]} />
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <InputField
              placeholder={authLabel.email[lang]}
              type="text"
              name="email"
              register={register}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <Label name="password" label={authLabel.password[lang]} />
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <InputField
              placeholder={authLabel.password[lang]}
              type="password"
              name="password"
              register={register}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <Button
        buttonText={authLabel.login[lang]}
        name=""
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      />
    </form>
  );
};

export default LoginForm;

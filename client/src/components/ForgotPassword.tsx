import { useLang } from "@/hooks/useLang";
import InputField from "@/ui/common/atoms/InputField";
import { SubmitHandler, useForm } from "react-hook-form";
import { authLabel } from "@/localization/auth";
import Button from "@/ui/common/atoms/Button";
import { SEND_OTP_TO_USER } from "@/mutation/queries";
import { useMutation } from "@apollo/client";
import { showToast } from "./ToastNotification";
import { useState } from "react";
import OTP from "./Otp";
import { Mail, ArrowRight } from 'lucide-react';
import Label from "@/ui/common/atoms/Label";

interface FormData {
  email: string;
}

const ForgotPassword = () => {
  const { register, handleSubmit, setValue, reset } = useForm<FormData>();
  const { lang } = useLang();
  const [isEmail, setIsEmail] = useState<string>('');
  const [senOtpToUser, { loading }] = useMutation(SEND_OTP_TO_USER);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const response = await senOtpToUser({ variables: { email: data.email } });
      showToast(response.data.senOtpToUser, "success");
      setIsEmail(data.email);
      reset();
    } catch (error: unknown) {
      if (error instanceof Error) {
        showToast(error.message, "error");
      } else {
        showToast("An error occurred", 'error');
      }
    }
};

  if (isEmail) {
    return <OTP email={isEmail} />;
  }

  return (
    <div className="min-h-[55vh] flex items-center justify-center">
      <div className="min-h-[40vh] flex flex-col items-center justify-center bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
          <Mail className="w-8 h-8 text-blue-600" />
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mb-2">{authLabel.forgotPassword[lang]}</h2>
        <p className="text-gray-600 text-center mb-8">
        {authLabel.forgotPasswordSlogan[lang]}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
          <div className="space-y-2">
            <Label 
              name="email" 
              label={authLabel.email[lang]} 
              className="text-sm font-medium text-gray-700"
            />
            <InputField
              setValue={setValue}
              placeholder={authLabel.email[lang]}
              type="email"
              name="email"
              register={register}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <Button 
            buttonText={loading ? `${authLabel.sending[lang]}` : authLabel.submit[lang]}
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2"
          />
        </form>

        <p className="mt-6 text-sm text-gray-500 text-center">
         {authLabel.rememberPassword[lang]} <a href="/login" className="text-blue-600 hover:text-blue-800">{authLabel.backToLogin[lang]}</a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;